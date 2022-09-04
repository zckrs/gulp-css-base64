'use strict';

// NodeJS library
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var util = require('util');
var Stream = require('stream').Stream;

// NPM library
var Vinyl = require('vinyl');
var fancyLog = require('fancy-log');
var PluginError = require('plugin-error');
var through = require('through2');
var request = require('request');
var buffers = require('buffers');
var async = require('async');
var chalk = require('chalk');

var rImages = /url(?:\(['|"]?)(.*?)(?:['|"]?\))(?!.*\/\*base64:skip\*\/)/ig;

function gulpCssBase64(opts) {
  opts = JSON.parse(JSON.stringify(opts || {}));
  if (!util.isArray(opts.extensionsAllowed)) {
    opts.extensionsAllowed = [];
  }

  opts.extensionsAllowed = opts.extensionsAllowed || [];
  opts.baseDir = opts.baseDir || '';
  opts.verbose = process.argv.indexOf('--verbose') !== -1;

  // Creating a stream through which each file will pass
  var stream = through.obj(function (file, enc, callbackStream) {
    var currentStream = this;
    var cache = [];

    if (file.isNull()) {
      // Do nothing if no contents
      currentStream.push(file);

      return callbackStream();
    }

    if (file.isBuffer()) {
      var src = file.contents.toString();
      var result = [];

      async.whilst(
        function () {
          result = rImages.exec(src);

          return result !== null;
        },
        function (callback) {
          if (cache[result[1]]) {
            src = src.replace(result[1], cache[result[1]]);
            callback();
            return;
          }

          var pureUrl = result[1].split('?')[0].split('#')[0];
          if (opts.extensionsAllowed.length !== 0 && opts.extensionsAllowed.indexOf(path.extname(pureUrl)) === -1) {
            log('Ignores ' + chalk.yellow(result[1]) + ', extension not allowed ' + chalk.yellow(path.extname(result[1])), opts.verbose);
            callback();
            return;
          }

          encodeResource(result[1], file, opts, function (fileRes) {
            if (undefined !== fileRes) {
              if (opts.maxWeightResource && fileRes.contents.length > opts.maxWeightResource) {
                log('Ignores ' + chalk.yellow(result[1]) + ', file is too big ' + chalk.yellow(fileRes.contents.length + ' bytes'), opts.verbose);
                callback();
                return;
              }

              var strRes = 'data:' + mime.lookup(fileRes.path) + ';base64,' + fileRes.contents.toString('base64');
              src = src.replace(result[1], strRes);

              // Store in cache
              cache[result[1]] = strRes;
            }

            callback();
          });
        },
        function () {
          file.contents = Buffer.from(src);
          currentStream.push(file);

          return callbackStream();
        }
      );
    }

    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-css-base64', 'Stream not supported!'));
    }
  });

  // Returning the file stream
  return stream;
}

function encodeResource(img, file, opts, doneCallback) {
  var fileRes = new Vinyl();

  if (/^data:/.test(img)) {
    log('Ignores ' + chalk.yellow(img.substring(0, 30) + '...') + ', already encoded', opts.verbose);
    doneCallback();
    return;
  }

  if (img[0] === '#') {
    log('Ignores ' + chalk.yellow(img.substring(0, 30) + '...') + ', SVG mask', opts.verbose);
    doneCallback();
    return;
  }

  if (/^(http|https|\/\/)/.test(img)) {
    log('Fetch ' + chalk.yellow(img), opts.verbose);
    // Different case for uri start '//'
    if (img[0] + img[1] === '//') {
      img = 'http:' + img;
    }

    fetchRemoteRessource(img, function (resultBuffer) {
      if (resultBuffer === null) {
        log('Error: ' + chalk.red(img) + ', unable to fetch', opts.verbose);
        doneCallback();
        return;
      }

      fileRes.path = img;
      fileRes.contents = resultBuffer;
      doneCallback(fileRes);
    });
  } else {
    var location = '';
    var binRes = '';

    location = img.charAt(0) === '/' ? (opts.baseDir || '') + img : path.join(path.dirname(file.path), (opts.baseDir || '') + '/' + img);
    location = location.replace(/([?#].*)$/, '');

    if (!fs.existsSync(location)) {
      log('Error: ' + chalk.red(location) + ', file not found', opts.verbose);
      doneCallback();
      return;
    }

    binRes = fs.readFileSync(location);

    fileRes.path = location;
    fileRes.contents = binRes;

    doneCallback(fileRes);
  }
}

function fetchRemoteRessource(url, callback) {
  var resultBuffer;
  var buffList = buffers();
  var imageStream = new Stream();

  imageStream.writable = true;
  imageStream.write = function (data) {
    buffList.push(Buffer.from(data));
  };

  imageStream.end = function () {
    resultBuffer = buffList.toBuffer();
  };

  request(url, function (error, response) {
    if (error) {
      callback(null);
      return;
    }

    // Bail if we get anything other than 200
    if (response.statusCode !== 200) {
      callback(null);
      return;
    }

    callback(resultBuffer);
  }).pipe(imageStream);
}

function log(message, isVerbose) {
  if (isVerbose === true) {
    fancyLog(message);
  }
}

// Exporting the plugin main function
module.exports = gulpCssBase64;

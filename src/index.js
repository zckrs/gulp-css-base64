'use strict';

// NodeJS library
var fs = require('fs');
var path = require("path");
var mime = require("mime");
var Stream = require('stream').Stream;

// NPM library
var async = require("async");
var through = require('through2');
var request = require('request');
var buffers = require('buffers');
var chalk = require('chalk');
var PluginError = require('gulp-util').PluginError;

// Local library
var log = require('./lib/log');

// Consts
var PLUGIN_NAME = 'gulp-css-base64';
var rImages = /url(?:\(['|"]?)(.*?)(?:['|"]?\))(?!.*\/\*base64:skip\*\/)/ig;

function gulpCssBase64(opts) {

    opts = opts || {};
    opts.deleteAfterEncoding = opts.deleteAfterEncoding || false;
    opts.maxWeightResource = opts.maxWeightResource || 32768;
    opts.extensionsAllowed = opts.extensionsAllowed || [];
    opts.baseDir = opts.baseDir || '';
    opts.preProcess = opts.preProcess || '';

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

                    if (opts.extensionsAllowed.length !== 0 && opts.extensionsAllowed.indexOf(path.extname(result[1])) == -1) {
                        log("Ignore " + chalk.yellow(result[1]) + ", extension not allowed " + chalk.yellow(path.extname(result[1])));
                        callback();
                        return;
                    }

                    encodeResource(result[1], file, opts, function (fileRes) {
                        if (undefined !== fileRes) {

                            if (fileRes.contents.length > opts.maxWeightResource) {
                                log("Ignore " + chalk.yellow(result[1]) + ", file is too big " + chalk.yellow(fileRes.contents.length + " bytes"));
                                callback();
                                return;
                            }

                            if (opts.deleteAfterEncoding && fileRes.path) {
                                log("Delete source file " + chalk.yellow(fileRes.path));
                                fs.unlinkSync(fileRes.path);
                            }

                            var strRes = "data:" + mime.lookup(fileRes.path) + ";base64," + fileRes.contents.toString("base64");
                            src = src.replace(result[1], strRes);

                            // Store in cache
                            cache[result[1]] = strRes;
                        }
                        callback();
                    });
                },
                function () {
                    file.contents = new Buffer(src);
                    currentStream.push(file);

                    return callbackStream();
                }
            );
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Stream not supported!'));
        }
    });

    // returning the file stream
    return stream;
}

function encodeResource(img, file, opts, doneCallback) {
    var fileRes = new gutil.File();

    if (/^data:/.test(img)) {
        log("Ignore " + chalk.yellow(img.substring(0, 30) + '...') + ", already encoded");
        doneCallback();
        return;
    }

    if (img[0] === '#') {
        log("Ignore " + chalk.yellow(img.substring(0, 30) + '...') + ", SVG mask");
        doneCallback();
        return;
    }

    if (/^(http|https|\/\/)/.test(img)) {
        log("Fetch " + chalk.yellow(img));
        // different case for uri start '//'
        if (img[0] + img[1] === '//') {
            img = 'http:' + img;
        }

        fetchRemoteRessource(img, function (resultBuffer) {
            if (null !== resultBuffer) {
                fileRes.path = img;
                fileRes.contents = resultBuffer;
                doneCallback(fileRes);
                return;
            } else {
                doneCallback();
                return;
            }
        });
    } else {
        var location = '';
        var binRes = '';

        location = img.charAt(0) === "/" ? (opts.baseDir || "") + img : path.join(path.dirname(file.path), (opts.baseDir || "") + "/" + img);

        if (!fs.existsSync(location)) {
            log("Error: " + chalk.red(location) + ", file not found");
            doneCallback();
            return;
        }

        binRes = fs.readFileSync(location);

        fileRes.path = location;
        fileRes.contents = binRes;

        if (opts.preProcess) {
            opts.preProcess(fileRes, function (resultFileRes) {
                doneCallback(resultFileRes);
                return;
            });
        } else {
            doneCallback(fileRes);
            return;
        }
    }

}

function fetchRemoteRessource(url, callback) {
    var resultBuffer;
    var buffList = buffers();
    var imageStream = new Stream();

    imageStream.writable = true;
    imageStream.write = function (data) {
        buffList.push(new Buffer(data));
    };
    imageStream.end = function () {
        resultBuffer = buffList.toBuffer();
    };

    request(url, function (error, response, body) {
        // Bail if we get anything other than 200
        if (response.statusCode !== 200) {
            log("Error: " + chalk.red(url) + ", unable to fetch " + chalk.red("code = " + response.statusCode));
            callback(null);
            return;
        }

        callback(resultBuffer);
    }).pipe(imageStream);
}

// Exporting the plugin main function
module.exports = gulpCssBase64;

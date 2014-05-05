var fs = require('fs');
var path = require("path");
var mime = require("mime");
var Stream = require('stream').Stream;

// through2 is a thin wrapper around node transform streams
var async = require("async");
var through = require('through2');
var request = require('request');
var buffers = require('buffers');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-css-base64';
var rImages = /url(?:\(['|"]?)(.*?)(?:['|"]?\))/ig;

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
        if (error) {
            callback("Unable to get " + url + ". Error: " + error.message);
            return;
        }

        // Bail if we get anything other than 200
        if (response.statusCode !== 200) {
            callback("Unable to get " + url + " because the URL did not return an image. Status code " + response.statusCode + " received");
            return;
        }

        callback(resultBuffer, url);
    }).pipe(imageStream);
};

function gulpCssBase64(opts) {

    opts = opts || {};
    opts.maxWeightResource = opts.maxWeightResource || 32768;
    opts.extensionsAllowed = opts.extensionsAllowed || [];

    // Creating a stream through which each file will pass
    var stream = through.obj(function (file, enc, callbackStream) {


        var currentStream = this;

        if (file.isNull()) {
            // Do nothing if no contents
        }

        if (file.isBuffer()) {
            var src = file.contents.toString();
            var result = [];
            var location = '';
            var binRes = '';

            async.whilst(
                function () {
                    result = rImages.exec(src);

                    return result !== null;
                },
                function (callback) {

                    fetchImage(result[1], opts, file.path, function(strRes) {
                        if(undefined !== strRes) {
                            src = src.replace(result[1], strRes);
                            console.log(strRes);
                        }
                        callback();
                    });

                },
                function (err) {

                }
            );

            file.contents = new Buffer(src);
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Stream not supported!'));
        }

        this.push(file);

        return callbackStream();
    });

    // returning the file stream
    return stream;
};

function fetchImage(img, opts, pathFile, doneCallback) {
    if(/^data:/.test(img)) {
        gutil.log("Resource is already base64 : " + gutil.colors.black.bgYellow(img.substring(0, 30) + '...'));

        return doneCallback();
    }

    if (opts.extensionsAllowed.length != 0) {
        if (opts.extensionsAllowed.indexOf(path.extname(img)) == -1) {
            gutil.log("Resource dont have allowed extension : " + gutil.colors.black.bgYellow(path.extname(img)));

            return doneCallback();
        }
    }

    if (/^(http|https|\/\/)/.test(img)) {
        gutil.log("Remote resource : " + gutil.colors.black.bgYellow(img));
        // different case for uri start '//'

        fetchRemoteRessource(img, function(resultBuffer, url) {
            var strRes = "data:" + mime.lookup(url) + ";base64," + resultBuffer.toString("base64");

            doneCallback(strRes);

        });

        // request.get(img, function (error, response, body) {
        //     if (!error && response.statusCode == 200) {
        //         // call a function who check weight and convert in base 64
        //         binRes = new Buffer(body, 'binary');
        //         var strRes = "data:" + mime.lookup(location) + ";base64," + binRes.toString("base64");
        //         console.log(strRes);
        //         console.log(response.request.href);
        //         src = src.replace(response.request.href, strRes);
        //         console.log(src);

        //     } else {
        //         gutil.log("Remote resource not found : " + gutil.colors.black.bgYellow(img));

        //     }

        // });


        // return doneCallback();


    } else {
        location = path.join(path.dirname(pathFile), img);

        if (!fs.existsSync(location)) {
            gutil.log("Ressource not found : " + gutil.colors.black.bgYellow(location));

            return doneCallback();
        }

        binRes = fs.readFileSync(location);

        if(binRes.length > opts.maxWeightResource) {
            gutil.log("Resource is too big : " + gutil.colors.black.bgYellow(binRes.length + " octets"));

            return doneCallback();
        }

        var strRes = "data:" + mime.lookup(location) + ";base64," + binRes.toString("base64");

        doneCallback(strRes);
    }


  };

// Exporting the plugin main function
module.exports = gulpCssBase64;

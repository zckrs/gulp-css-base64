'use strict';

var fs = require('fs');
var path = require("path");
var mime = require("mime");
var Stream = require('stream').Stream;

var async = require("async");
var through = require('through2');
var request = require('request');
var buffers = require('buffers');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

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
                        gutil.log("gulp-css-base64 : Resource dont have allowed extension " + gutil.colors.black.bgYellow(path.extname(result[1])));
                        callback();
                        return;
                    }

                    encodeResource(result[1], file, opts, function (resultBuffer, location) {
                        if (undefined !== resultBuffer) {

                            if (resultBuffer.length > opts.maxWeightResource) {
                                gutil.log("gulp-css-base64 : File is too big " + gutil.colors.black.bgYellow(resultBuffer.length + " octets") + " : " + result[1]);
                                callback();
                                return;
                            }

                            if(opts.deleteAfterEncoding && location) {
                                gutil.log("gulp-css-base64 : Resource delete " + gutil.colors.black.bgYellow(location));
                                fs.unlinkSync(location);
                            }

                            var strRes = "data:" + mime.lookup(location) + ";base64," + resultBuffer.toString("base64");
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
    if (/^data:/.test(img)) {
        gutil.log("gulp-css-base64 : Resource is already base64 " + gutil.colors.black.bgYellow(img.substring(0, 30) + '...'));
        doneCallback();
        return;
    }

    if (/^(http|https|\/\/)/.test(img)) {
        gutil.log("gulp-css-base64 : Remote resource " + gutil.colors.black.bgYellow(img));
        // different case for uri start '//'
        if (img[0] + img[1] === '//') {
            img = 'http:' + img;
        }

        fetchRemoteRessource(img, function (resultBuffer) {
            if (null !== resultBuffer) {
                doneCallback(resultBuffer, img);
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
            gutil.log("gulp-css-base64 : File not found " + gutil.colors.black.bgYellow(location));
            doneCallback();
            return;
        }

        binRes = fs.readFileSync(location);

        if(opts.preProcess) {
            opts.preProcess(binRes, function (resultBuffer) {
                if (null !== resultBuffer) {
                    doneCallback(resultBuffer, location);
                    return;
                } else {
                    doneCallback();
                    return;
                }
            });
        } else {
            doneCallback(binRes, location);
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
        if (error) {
            gutil.log("gulp-css-base64 : Unable to get resource " + gutil.colors.black.bgYellow(url) + ". Error " + gutil.colors.black.bgYellow(error.message));
            callback(null);
            return;
        }

        // Bail if we get anything other than 200
        if (response.statusCode !== 200) {
            gutil.log("gulp-css-base64 : Unable to get resource " + gutil.colors.black.bgYellow(url) + ". Status code " + gutil.colors.black.bgYellow(response.statusCode));
            callback(null);
            return;
        }

        callback(resultBuffer);
    }).pipe(imageStream);
}

// Exporting the plugin main function
module.exports = gulpCssBase64;

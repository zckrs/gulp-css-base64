var fs = require('fs');
var path = require("path");
var mime = require("mime");

// through2 is a thin wrapper around node transform streams
var async = require("async");
var through = require('through2');
var request = require('request');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-css-base64';
var rImages = /url(?:\(['|"]?)(.*?)(?:['|"]?\))/ig;

function gulpCssBase64(opts) {

    opts = opts || {};
    opts.maxWeightResource = opts.maxWeightResource || 32768;
    opts.extensionsAllowed = opts.extensionsAllowed || [];

    // Creating a stream through which each file will pass
    var stream = through.obj(function (file, enc, callback) {

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

                    if(/^data:/.test(result[1])) {
                        gutil.log("Resource is already base64 : " + gutil.colors.black.bgYellow(result[1].substring(0, 30) + '...'));

                        return callback();
                    }

                    if (opts.extensionsAllowed.length != 0) {
                        if (opts.extensionsAllowed.indexOf(path.extname(result[1])) == -1) {
                            gutil.log("Resource dont have allowed extension : " + gutil.colors.black.bgYellow(path.extname(result[1])));

                            return callback();
                        }
                    }

                    if (/^(http|https|\/\/)/.test(result[1])) {
                        gutil.log("Remote resource : " + gutil.colors.black.bgYellow(result[1]));

                        request.get(result[1], function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                console.log(new Buffer(body, 'binary').toString('base64'));
                            }
                        });

                        return callback();
                    } else {
                        location = path.join(path.dirname(file.path), result[1]);

                        if (!fs.existsSync(location)) {
                            gutil.log("Ressource not found : " + gutil.colors.black.bgYellow(location));

                            return callback();
                        }

                        binRes = fs.readFileSync(location);
                    }

                    if(binRes.length > opts.maxWeightResource) {
                        gutil.log("Resource is too big : " + gutil.colors.black.bgYellow(binRes.length + " octets"));

                        return callback();
                    }

                    var strRes = "data:" + mime.lookup(location) + ";base64," + binRes.toString("base64");

                    src = src.replace(result[1], strRes);

                    callback();
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

        return callback();
    });

    // returning the file stream
    return stream;
};

// Exporting the plugin main function
module.exports = gulpCssBase64;

var fs = require('fs');
var path = require("path");
var mime = require("mime");

// through2 is a thin wrapper around node transform streams
var async = require("async");
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-css-base64';
var rImages = /url(?:\(['|"]?)(.*?)(?:['|"]?\))/ig;

// Read the file in and convert it.
/**
 * Conver a resource in base64
 * @param  {string} img  location of resource
 * @param  {object} opts
 * @todo manage options (extension, maxBase64Size, debug to see log)
 *
 * @return {string}      uri base64
 */
function encodeImage(img, opts) {
    var binImg = fs.readFileSync(img);

    if(binImg.length > opts.maxWeightResource) {
        gutil.log("Resource is too big : " + binImg.length + " octets");

        return img;
    }

    gutil.log("weight    : " + binImg.length);
    gutil.log("extension : " + path.extname(img));

    var mimeType = mime.lookup(img);

    var strImg = "data:" + mimeType + ";base64," + binImg.toString("base64");

    return strImg;
}

function gulpCssBase64(opts) {

    opts = opts || {};
    opts.maxWeightResource = opts.maxWeightResource || 10000;

    // Creating a stream through which each file will pass
    var stream = through.obj(function (file, enc, callback) {

        var currentStream = this;

        if (file.isNull()) {
            // Do nothing if no contents
        }

        if (file.isBuffer()) {
            var src = file.contents.toString();
            var result = [];
            var resultEncoded = [];
            var location = '';

            async.whilst(
                function () {
                    result = rImages.exec(src);

                    return result !== null;
                },
                function (callback) {
                    if(/^data:/.test(result[1])) {
                        gutil.log("Resource is already base64 : " + gutil.colors.white.bgRed(result[1]));
                    } else {
                        //TODO check extension
                        location = path.join(path.dirname(file.path), result[1]);

                        if (!fs.existsSync(location)) {
                            currentStream.emit('error', new PluginError(PLUGIN_NAME, "Resource not found " + gutil.colors.white.bgRed(location)));
                        } else {
                            src = src.replace(result[1], encodeImage(location, opts));
                        }
                    }

                    callback();
                },
                function () {
                    gutil.log(gutil.colors.cyan.bold('DONE !'));
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

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
var rImages = /url(?:\(['|"]?)(.*?)(?:['|"]?\))/img;

// Read the file in and convert it.
/**
 * Conver a resource in base64
 * @param  {string} img  location of resource
 * @param  {object} opts
 * @todo manage options (extension, maxBase64Size)
 *
 * @return {string}      uri base64
 */
function encodeImage(img, opts) {
    var binImg = fs.readFileSync(img);
    var mimeType = mime.lookup(img);

    var strImg = "data:" + mimeType + ";base64," + binImg.toString("base64");

    return strImg;
}

function gulpCssBase64() {

    // Creating a stream through which each file will pass
    var stream = through.obj(function (file, enc, callback) {

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
                    console.log(gutil.colors.green(result[1]));

                    location = path.join(path.dirname(file.path), result[1]);

                    if (!fs.existsSync(location)) {
                        gutil.log("Ressource not found : " + gutil.colors.white.bgRed(location));
                    } else {
                        src = src.replace(result[1], encodeImage(location, null));
                    }

                    callback();
                },
                function () {
                    console.log(gutil.colors.cyan.bold('DONE !'));
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

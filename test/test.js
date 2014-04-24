var assert = require('assert');
var es = require('event-stream');
var gutil = require('gulp-util');
var base64 = require("../src/index");

describe('gulp-css-base64', function () {

    // define here beforeEach(), afterEach()

    describe('in buffer mode', function () {
        it('should convert url() content', function (done) {

            // create the fake file
            var fakeFile = new gutil.File({
                contents: new Buffer('.button_alert{background:url(test/fixtures/image/very-very-small.png) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
            });

            // Create a css-base64 plugin stream
            var stream = base64();

            // write the fake file to it
            stream.write(fakeFile);

            // wait for the file to come back out
            stream.once('data', function (file) {
                // make sure it came out the same way it went in
                assert(file.isBuffer());

                // check the contents
                assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANAQAAAABakNnRAAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAEgAAABIAEbJaz4AAAArSURBVAjXY/j/g2H/C4b5Jxj6OxgaOEBoxgmGDg8GIACyuRoYjkowfKgAACBpDLQ2kvRRAAAAAElFTkSuQmCC) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
                done();
            });

        });

        it('should convert url(\'\') content with quotes', function (done) {

            // create the fake file
            var fakeFile = new gutil.File({
                contents: new Buffer('.button_alert{background:url(\'test/fixtures/image/very-very-small.png\') no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
            });

            // Create a css-base64 plugin stream
            var stream = base64();

            // write the fake file to it
            stream.write(fakeFile);

            // wait for the file to come back out
            stream.once('data', function (file) {
                // make sure it came out the same way it went in
                assert(file.isBuffer());

                // check the contents
                assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANAQAAAABakNnRAAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAEgAAABIAEbJaz4AAAArSURBVAjXY/j/g2H/C4b5Jxj6OxgaOEBoxgmGDg8GIACyuRoYjkowfKgAACBpDLQ2kvRRAAAAAElFTkSuQmCC\') no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
                done();
            });
        });

        it('should convert url(\"\") content with double quotes', function (done) {
            // create the fake file
            var fakeFile = new gutil.File({
                contents: new Buffer('.button_alert{background:url(\"test/fixtures/image/very-very-small.png\") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
            });

            // Create a css-base64 plugin stream
            var stream = base64();

            // write the fake file to it
            stream.write(fakeFile);

            // wait for the file to come back out
            stream.once('data', function (file) {
                // make sure it came out the same way it went in
                assert(file.isBuffer());

                // check the contents
                assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANAQAAAABakNnRAAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAEgAAABIAEbJaz4AAAArSURBVAjXY/j/g2H/C4b5Jxj6OxgaOEBoxgmGDg8GIACyuRoYjkowfKgAACBpDLQ2kvRRAAAAAElFTkSuQmCC\") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
                done();
            });
        });

        it('should ignore if file image is not found', function (done) {
            // create the fake file
            var fakeFile = new gutil.File({
                contents: new Buffer('.button_alert{background:url(wrong/path/image.png) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
            });

            // Create a css-base64 plugin stream
            var stream = base64();

            // write the fake file to it
            stream.write(fakeFile);

            // wait for the file to come back out
            stream.once('data', function (file) {
                // make sure it came out the same way it went in
                assert(file.isBuffer());

                // check the contents
                assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(wrong/path/image.png\) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
                done();
            });
        });


    });

    describe('in stream mode', function () {
        it('should throw a gutil.PluginError', function (done) {
            // create the fake file
            var fakeFile = new gutil.File({
                contents: es.readArray(['stream', 'with', 'those', 'contents'])
            });

            // Create a prefixer plugin stream
            var stream = base64();

            assert.throws(
                function () {
                    stream.write(fakeFile);
                },
                function (err) {
                    if (err instanceof gutil.PluginError && err.message === 'Stream not supported!') {
                        return true;
                    }
                }

            );
            done();
        });
    });

    describe('with null contents', function () {
        it('do nothing if file is null', function (done) {
            // create the fake file
            var fakeFile = new gutil.File(null);

            // Create a css-base64 plugin stream
            var stream = base64();

            // write the fake file to it
            stream.write(fakeFile);

            // wait for the file to come back out
            stream.once('data', function (file) {
                // make sure it came out the same way it went in
                assert(file.isNull());

                // check the contents
                assert.equal(file.contents, null);
                done();
            });
        });

    });

});

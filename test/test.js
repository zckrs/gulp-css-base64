'use strict';

// NodeJS library
var assert = require('assert');

// NPM library
var gutil = require('gulp-util');
var es = require('event-stream');

// Local library
var base64 = require('../src/index');

describe('gulp-css-base64', function () {
  // define here beforeEach(), afterEach()

  it('should not modify original options object', function () {
    var opts = {
      foo: 'bar'
    };

    base64(opts);
    assert.equal(opts.maxWeightResource, undefined);
  });

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

    it('should convert url() content with questionmark at end', function (done) {
            // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(\'test/fixtures/image/very-very-small.png?awesomeQuestionmark\') no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
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

    it('should convert url() content with questionmark at end even if extensionsAllowed is passed', function (done) {
            // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(\'test/fixtures/image/very-very-small.png?awesomeQuestionmark\') no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

            // Create a css-base64 plugin stream
      var stream = base64({
        extensionsAllowed: ['.gif', '.jpg', '.png']
      });

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

    it('should convert url() content with hashtag at end', function (done) {
            // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(\'test/fixtures/image/very-very-small.png#awesomeHashtag\') no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
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

    it('should convert url() content with hashtag at end even if extensionsAllowed is passed', function (done) {
            // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(\'test/fixtures/image/very-very-small.png#awesomeHashtag\') no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

            // Create a css-base64 plugin stream
      var stream = base64({
        extensionsAllowed: ['.gif', '.jpg', '.png']
      });

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

    it('should ignore if image weight is greater than maxWeightResource default value', function (done) {
            // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(test/fixtures/image/very-very-small.png) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

            // Create a css-base64 plugin stream
      var stream = base64({
        maxWeightResource: 10
      });

            // write the fake file to it
      stream.write(fakeFile);

            // wait for the file to come back out
      stream.once('data', function (file) {
                // make sure it came out the same way it went in
        assert(file.isBuffer());

                // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(test/fixtures/image/very-very-small.png) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should ignore if url() is already base64', function (done) {
            // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANAQAAAABakNnRAAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAEgAAABIAEbJaz4AAAArSURBVAjXY/j/g2H/C4b5Jxj6OxgaOEBoxgmGDg8GIACyuRoYjkowfKgAACBpDLQ2kvRRAAAAAElFTkSuQmCC) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
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

    it('should ignore if url() begin with #', function (done) {
            // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{mask-image: url("#stark-svg-mask");}')
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
        assert.equal(file.contents.toString('utf8'), '.button_alert{mask-image: url("#stark-svg-mask");}');
        done();
      });
    });

    it('should ignore if resource is not found', function (done) {
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
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(wrong/path/image.png) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should ignore if remote resource is not found', function (done) {
            // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(http://www.google.com/favicon1356.ico) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
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
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(http://www.google.com/favicon1356.ico) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should ignore if remote resource is not found with error', function (done) {
            // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(http:////www.google.com/favicon.ico) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
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
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(http:////www.google.com/favicon.ico) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should ignore if extension name is not allowed', function (done) {
            // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(test/fixtures/image/very-very-small.png) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

            // Create a css-base64 plugin stream
      var stream = base64({
        extensionsAllowed: ['.gif', '.jpg']
      });

            // write the fake file to it
      stream.write(fakeFile);

            // wait for the file to come back out
      stream.once('data', function (file) {
                // make sure it came out the same way it went in
        assert(file.isBuffer());

                // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(test/fixtures/image/very-very-small.png) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should use option base directory to fetch local resource with relative path', function (done) {
            // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(very-very-small.png) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

            // Create a css-base64 plugin stream
      var stream = base64({
        baseDir: 'test/fixtures/image'
      });

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

    it('should use option base directory to fetch local resource with absolute path', function (done) {
            // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(/very-very-small.png) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

            // Create a css-base64 plugin stream
      var stream = base64({
        baseDir: 'test/fixtures/image'
      });

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

    it('should ignore if directive comment exist at end of line', function (done) {
            // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(test/fixtures/image/very-very-small.png)/*base64:skip*/}')
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
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(test/fixtures/image/very-very-small.png)/*base64:skip*/}');
        done();
      });
    });

    it('should ignore if directive comment exist at end of line with custom regexp', function (done) {
            // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(test/fixtures/image/very-very-small.png)/*myRegexp*/}')
      });

            // Create a css-base64 plugin stream
      var stream = base64({
        regexp: /url(?:\(['|"]?)(.*?)(?:['|"]?\))(?!.*\/\*myRegexp\*\/)/ig
      });

            // write the fake file to it
      stream.write(fakeFile);

            // wait for the file to come back out
      stream.once('data', function (file) {
                // make sure it came out the same way it went in
        assert(file.isBuffer());

                // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(test/fixtures/image/very-very-small.png)/*myRegexp*/}');
        done();
      });
    });

    it('should use cache when css contain duplicate uri resource', function (done) {
            // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(test/fixtures/image/very-very-small.png) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline.button_alert{background:url(test/fixtures/image/very-very-small.png) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
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
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANAQAAAABakNnRAAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAEgAAABIAEbJaz4AAAArSURBVAjXY/j/g2H/C4b5Jxj6OxgaOEBoxgmGDg8GIACyuRoYjkowfKgAACBpDLQ2kvRRAAAAAElFTkSuQmCC) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline.button_alert{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANAQAAAABakNnRAAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAEgAAABIAEbJaz4AAAArSURBVAjXY/j/g2H/C4b5Jxj6OxgaOEBoxgmGDg8GIACyuRoYjkowfKgAACBpDLQ2kvRRAAAAAElFTkSuQmCC) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');

        done();
      });
    });

    it('should convert if remote resource (http://)', function (done) {
            // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(http://www.google.com/favicon.ico) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
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
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(data:image/x-icon;base64,AAABAAIAEBAAAAEAIABoBAAAJgAAACAgAAABACAAqBAAAI4EAAAoAAAAEAAAACAAAAABACAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///zD9/f2W/f392P39/fn9/f35/f391/39/ZT+/v4uAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v7+Cf39/Zn///////////////////////////////////////////39/ZX///8IAAAAAAAAAAAAAAAA/v7+Cf39/cH/////+v35/7TZp/92ul3/WKs6/1iqOv9yuFn/rNWd//j79v///////f39v////wgAAAAAAAAAAP39/Zn/////7PXp/3G3WP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP+Or1j//vDo///////9/f2VAAAAAP///zD/////+vz5/3G3V/9TqDT/WKo6/6LQkf/U6cz/1urO/6rUm/+Zo0r/8IZB//adZ////v7///////7+/i79/f2Y/////4nWzf9Lqkj/Vqo4/9Xqzv///////////////////////ebY//SHRv/0hUL//NjD///////9/f2U/f392v////8sxPH/Ebzt/43RsP/////////////////////////////////4roL/9IVC//i1jf///////f391/39/fr/////Cr37/wW8+/+16/7/////////////////9IVC//SFQv/0hUL/9IVC//SFQv/3pnX///////39/fn9/f36/////wu++/8FvPv/tuz+//////////////////SFQv/0hUL/9IVC//SFQv/0hUL/96p7///////9/f35/f392/////81yfz/CrL5/2uk9v///////////////////////////////////////////////////////f392P39/Zn/////ks/7/zdS7P84Rur/0NT6///////////////////////9/f////////////////////////39/Zb+/v4y//////n5/v9WYu3/NUPq/ztJ6/+VnPT/z9L6/9HU+v+WnfT/Ul7t/+Hj/P////////////////////8wAAAAAP39/Z3/////6Or9/1hj7v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v9sdvD////////////9/f2YAAAAAAAAAAD///8K/f39w//////5+f7/paz2/11p7v88Suv/Okfq/1pm7v+iqfX/+fn+///////9/f3B/v7+CQAAAAAAAAAAAAAAAP///wr9/f2d///////////////////////////////////////////9/f2Z/v7+CQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/jL9/f2Z/f392/39/fr9/f36/f392v39/Zj///8wAAAAAAAAAAAAAAAAAAAAAPAPAADAAwAAgAEAAIABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAACAAQAAwAMAAPAPAAAoAAAAIAAAAEAAAAABACAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/g3+/v5X/f39mf39/cj9/f3q/f39+f39/fn9/f3q/f39yP39/Zn+/v5W////DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/iT9/f2c/f399f/////////////////////////////////////////////////////9/f31/f39mv7+/iMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/gn9/f2K/f39+////////////////////////////////////////////////////////////////////////////f39+v39/Yf///8IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v4k/f390v////////////////////////////////////////////////////////////////////////////////////////////////39/dD///8iAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////MP39/er//////////////////////////+r05v+v16H/gsBs/2WxSf9Wqjj/Vqk3/2OwRv99vWX/pdKV/97u2P////////////////////////////39/ej+/v4vAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/iT9/f3q/////////////////////+v15/+Pxnv/VKk2/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/36+Z//d7tf///////////////////////39/ej///8iAAAAAAAAAAAAAAAAAAAAAAAAAAD///8K/f390//////////////////////E4bn/XKw+/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1apN/+x0pv///////////////////////39/dD///8IAAAAAAAAAAAAAAAAAAAAAP39/Yv/////////////////////sdij/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/YKU1/8qOPv/5wZ////////////////////////39/YcAAAAAAAAAAAAAAAD+/v4l/f39+////////////////8Lgt/9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9utlT/n86N/7faqv+426v/pdKV/3u8ZP9UqDX/U6g0/3egN//jiUH/9IVC//SFQv/82MP//////////////////f39+v7+/iMAAAAAAAAAAP39/Z3////////////////q9Ob/W6w+/1OoNP9TqDT/U6g0/1OoNP9nskz/zOXC/////////////////////////////////+Dv2v+osWP/8YVC//SFQv/0hUL/9IVC//WQVP/++fb//////////////////f39mgAAAAD+/v4O/f399v///////////////4LHj/9TqDT/U6g0/1OoNP9TqDT/dblc//L58P/////////////////////////////////////////////8+v/3p3f/9IVC//SFQv/0hUL/9IVC//rIqf/////////////////9/f31////DP7+/ln////////////////f9v7/Cbz2/zOwhv9TqDT/U6g0/2KwRv/v9+z///////////////////////////////////////////////////////738//1kFT/9IVC//SFQv/0hUL/9plg///////////////////////+/v5W/f39nP///////////////4jf/f8FvPv/Bbz7/yG1s/9QqDz/vN2w//////////////////////////////////////////////////////////////////rHqP/0hUL/9IVC//SFQv/0hUL//vDn//////////////////39/Zn9/f3L////////////////R878/wW8+/8FvPv/Bbz7/y7C5P/7/fr//////////////////////////////////////////////////////////////////ere//SFQv/0hUL/9IVC//SFQv/718H//////////////////f39yP39/ez///////////////8cwvv/Bbz7/wW8+/8FvPv/WNL8///////////////////////////////////////0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//rIqv/////////////////9/f3q/f39+v///////////////we9+/8FvPv/Bbz7/wW8+/993P3///////////////////////////////////////SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/+cGf//////////////////39/fn9/f36////////////////B737/wW8+/8FvPv/Bbz7/33c/f//////////////////////////////////////9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/6xaX//////////////////f39+f39/e3///////////////8cwvv/Bbz7/wW8+/8FvPv/WdP8///////////////////////////////////////0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//vVv//////////////////9/f3q/f39y////////////////0bN/P8FvPv/Bbz7/wW8+/8hrvn/+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////39/cj9/f2c////////////////ht/9/wW8+/8FvPv/FZP1/zRJ6/+zuPf//////////////////////////////////////////////////////////////////////////////////////////////////////////////////f39mf7+/lr////////////////d9v7/B7n7/yB38f81Q+r/NUPq/0hV7P/u8P3////////////////////////////////////////////////////////////////////////////////////////////////////////////+/v5X////D/39/ff///////////////9tkPT/NUPq/zVD6v81Q+r/NUPq/2Fs7//y8v7////////////////////////////////////////////09f7//////////////////////////////////////////////////f399f7+/g0AAAAA/f39n////////////////+Tm/P89Suv/NUPq/zVD6v81Q+r/NUPq/1Bc7f/IzPn/////////////////////////////////x8v5/0xY7P+MlPP////////////////////////////////////////////9/f2cAAAAAAAAAAD+/v4n/f39/P///////////////7W69/81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v9ZZe7/k5v0/6609/+vtff/lJv0/1pm7v81Q+r/NUPq/zVD6v+GjvL//v7//////////////////////////////f39+/7+/iQAAAAAAAAAAAAAAAD9/f2N/////////////////////6Cn9f81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v+BivL////////////////////////////9/f2KAAAAAAAAAAAAAAAAAAAAAP7+/gv9/f3V/////////////////////7W69/8+S+v/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/P0zr/7q/+P///////////////////////f390v7+/gkAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/ib9/f3r/////////////////////+Xn/P94gfH/NkTq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NkTq/3Z/8f/l5/z///////////////////////39/er+/v4kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/jL9/f3r///////////////////////////k5vz/nqX1/2p08P9IVez/OEbq/zdF6v9GU+z/aHLv/5qh9f/i5Pz////////////////////////////9/f3q////MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/ib9/f3V/////////////////////////////////////////////////////////////////////////////////////////////////f390v7+/iQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wr9/f2N/f39/P///////////////////////////////////////////////////////////////////////////f39+/39/Yv+/v4JAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v4n/f39n/39/ff//////////////////////////////////////////////////////f399v39/Z3+/v4lAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v7+Dv7+/lr9/f2c/f39y/39/e39/f36/f39+v39/ez9/f3L/f39nP7+/ln+/v4OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AA///AAD//AAAP/gAAB/wAAAP4AAAB8AAAAPAAAADgAAAAYAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAABgAAAAcAAAAPAAAAD4AAAB/AAAA/4AAAf/AAAP/8AAP//wAP/) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should convert if remote resource (https://)', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(https://www.google.com/favicon.ico) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
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
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(data:image/x-icon;base64,AAABAAIAEBAAAAEAIABoBAAAJgAAACAgAAABACAAqBAAAI4EAAAoAAAAEAAAACAAAAABACAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///zD9/f2W/f392P39/fn9/f35/f391/39/ZT+/v4uAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v7+Cf39/Zn///////////////////////////////////////////39/ZX///8IAAAAAAAAAAAAAAAA/v7+Cf39/cH/////+v35/7TZp/92ul3/WKs6/1iqOv9yuFn/rNWd//j79v///////f39v////wgAAAAAAAAAAP39/Zn/////7PXp/3G3WP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP+Or1j//vDo///////9/f2VAAAAAP///zD/////+vz5/3G3V/9TqDT/WKo6/6LQkf/U6cz/1urO/6rUm/+Zo0r/8IZB//adZ////v7///////7+/i79/f2Y/////4nWzf9Lqkj/Vqo4/9Xqzv///////////////////////ebY//SHRv/0hUL//NjD///////9/f2U/f392v////8sxPH/Ebzt/43RsP/////////////////////////////////4roL/9IVC//i1jf///////f391/39/fr/////Cr37/wW8+/+16/7/////////////////9IVC//SFQv/0hUL/9IVC//SFQv/3pnX///////39/fn9/f36/////wu++/8FvPv/tuz+//////////////////SFQv/0hUL/9IVC//SFQv/0hUL/96p7///////9/f35/f392/////81yfz/CrL5/2uk9v///////////////////////////////////////////////////////f392P39/Zn/////ks/7/zdS7P84Rur/0NT6///////////////////////9/f////////////////////////39/Zb+/v4y//////n5/v9WYu3/NUPq/ztJ6/+VnPT/z9L6/9HU+v+WnfT/Ul7t/+Hj/P////////////////////8wAAAAAP39/Z3/////6Or9/1hj7v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v9sdvD////////////9/f2YAAAAAAAAAAD///8K/f39w//////5+f7/paz2/11p7v88Suv/Okfq/1pm7v+iqfX/+fn+///////9/f3B/v7+CQAAAAAAAAAAAAAAAP///wr9/f2d///////////////////////////////////////////9/f2Z/v7+CQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/jL9/f2Z/f392/39/fr9/f36/f392v39/Zj///8wAAAAAAAAAAAAAAAAAAAAAPAPAADAAwAAgAEAAIABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAACAAQAAwAMAAPAPAAAoAAAAIAAAAEAAAAABACAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/g3+/v5X/f39mf39/cj9/f3q/f39+f39/fn9/f3q/f39yP39/Zn+/v5W////DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/iT9/f2c/f399f/////////////////////////////////////////////////////9/f31/f39mv7+/iMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/gn9/f2K/f39+////////////////////////////////////////////////////////////////////////////f39+v39/Yf///8IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v4k/f390v////////////////////////////////////////////////////////////////////////////////////////////////39/dD///8iAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////MP39/er//////////////////////////+r05v+v16H/gsBs/2WxSf9Wqjj/Vqk3/2OwRv99vWX/pdKV/97u2P////////////////////////////39/ej+/v4vAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/iT9/f3q/////////////////////+v15/+Pxnv/VKk2/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/36+Z//d7tf///////////////////////39/ej///8iAAAAAAAAAAAAAAAAAAAAAAAAAAD///8K/f390//////////////////////E4bn/XKw+/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1apN/+x0pv///////////////////////39/dD///8IAAAAAAAAAAAAAAAAAAAAAP39/Yv/////////////////////sdij/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/YKU1/8qOPv/5wZ////////////////////////39/YcAAAAAAAAAAAAAAAD+/v4l/f39+////////////////8Lgt/9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9utlT/n86N/7faqv+426v/pdKV/3u8ZP9UqDX/U6g0/3egN//jiUH/9IVC//SFQv/82MP//////////////////f39+v7+/iMAAAAAAAAAAP39/Z3////////////////q9Ob/W6w+/1OoNP9TqDT/U6g0/1OoNP9nskz/zOXC/////////////////////////////////+Dv2v+osWP/8YVC//SFQv/0hUL/9IVC//WQVP/++fb//////////////////f39mgAAAAD+/v4O/f399v///////////////4LHj/9TqDT/U6g0/1OoNP9TqDT/dblc//L58P/////////////////////////////////////////////8+v/3p3f/9IVC//SFQv/0hUL/9IVC//rIqf/////////////////9/f31////DP7+/ln////////////////f9v7/Cbz2/zOwhv9TqDT/U6g0/2KwRv/v9+z///////////////////////////////////////////////////////738//1kFT/9IVC//SFQv/0hUL/9plg///////////////////////+/v5W/f39nP///////////////4jf/f8FvPv/Bbz7/yG1s/9QqDz/vN2w//////////////////////////////////////////////////////////////////rHqP/0hUL/9IVC//SFQv/0hUL//vDn//////////////////39/Zn9/f3L////////////////R878/wW8+/8FvPv/Bbz7/y7C5P/7/fr//////////////////////////////////////////////////////////////////ere//SFQv/0hUL/9IVC//SFQv/718H//////////////////f39yP39/ez///////////////8cwvv/Bbz7/wW8+/8FvPv/WNL8///////////////////////////////////////0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//rIqv/////////////////9/f3q/f39+v///////////////we9+/8FvPv/Bbz7/wW8+/993P3///////////////////////////////////////SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/+cGf//////////////////39/fn9/f36////////////////B737/wW8+/8FvPv/Bbz7/33c/f//////////////////////////////////////9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/6xaX//////////////////f39+f39/e3///////////////8cwvv/Bbz7/wW8+/8FvPv/WdP8///////////////////////////////////////0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//vVv//////////////////9/f3q/f39y////////////////0bN/P8FvPv/Bbz7/wW8+/8hrvn/+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////39/cj9/f2c////////////////ht/9/wW8+/8FvPv/FZP1/zRJ6/+zuPf//////////////////////////////////////////////////////////////////////////////////////////////////////////////////f39mf7+/lr////////////////d9v7/B7n7/yB38f81Q+r/NUPq/0hV7P/u8P3////////////////////////////////////////////////////////////////////////////////////////////////////////////+/v5X////D/39/ff///////////////9tkPT/NUPq/zVD6v81Q+r/NUPq/2Fs7//y8v7////////////////////////////////////////////09f7//////////////////////////////////////////////////f399f7+/g0AAAAA/f39n////////////////+Tm/P89Suv/NUPq/zVD6v81Q+r/NUPq/1Bc7f/IzPn/////////////////////////////////x8v5/0xY7P+MlPP////////////////////////////////////////////9/f2cAAAAAAAAAAD+/v4n/f39/P///////////////7W69/81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v9ZZe7/k5v0/6609/+vtff/lJv0/1pm7v81Q+r/NUPq/zVD6v+GjvL//v7//////////////////////////////f39+/7+/iQAAAAAAAAAAAAAAAD9/f2N/////////////////////6Cn9f81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v+BivL////////////////////////////9/f2KAAAAAAAAAAAAAAAAAAAAAP7+/gv9/f3V/////////////////////7W69/8+S+v/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/P0zr/7q/+P///////////////////////f390v7+/gkAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/ib9/f3r/////////////////////+Xn/P94gfH/NkTq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NkTq/3Z/8f/l5/z///////////////////////39/er+/v4kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/jL9/f3r///////////////////////////k5vz/nqX1/2p08P9IVez/OEbq/zdF6v9GU+z/aHLv/5qh9f/i5Pz////////////////////////////9/f3q////MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/ib9/f3V/////////////////////////////////////////////////////////////////////////////////////////////////f390v7+/iQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wr9/f2N/f39/P///////////////////////////////////////////////////////////////////////////f39+/39/Yv+/v4JAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v4n/f39n/39/ff//////////////////////////////////////////////////////f399v39/Z3+/v4lAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v7+Dv7+/lr9/f2c/f39y/39/e39/f36/f39+v39/ez9/f3L/f39nP7+/ln+/v4OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AA///AAD//AAAP/gAAB/wAAAP4AAAB8AAAAPAAAADgAAAAYAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAABgAAAAcAAAAPAAAAD4AAAB/AAAA/4AAAf/AAAP/8AAP//wAP/) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should convert if remote resource (//)', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(//www.google.com/favicon.ico) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
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
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(data:image/x-icon;base64,AAABAAIAEBAAAAEAIABoBAAAJgAAACAgAAABACAAqBAAAI4EAAAoAAAAEAAAACAAAAABACAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///zD9/f2W/f392P39/fn9/f35/f391/39/ZT+/v4uAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v7+Cf39/Zn///////////////////////////////////////////39/ZX///8IAAAAAAAAAAAAAAAA/v7+Cf39/cH/////+v35/7TZp/92ul3/WKs6/1iqOv9yuFn/rNWd//j79v///////f39v////wgAAAAAAAAAAP39/Zn/////7PXp/3G3WP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP+Or1j//vDo///////9/f2VAAAAAP///zD/////+vz5/3G3V/9TqDT/WKo6/6LQkf/U6cz/1urO/6rUm/+Zo0r/8IZB//adZ////v7///////7+/i79/f2Y/////4nWzf9Lqkj/Vqo4/9Xqzv///////////////////////ebY//SHRv/0hUL//NjD///////9/f2U/f392v////8sxPH/Ebzt/43RsP/////////////////////////////////4roL/9IVC//i1jf///////f391/39/fr/////Cr37/wW8+/+16/7/////////////////9IVC//SFQv/0hUL/9IVC//SFQv/3pnX///////39/fn9/f36/////wu++/8FvPv/tuz+//////////////////SFQv/0hUL/9IVC//SFQv/0hUL/96p7///////9/f35/f392/////81yfz/CrL5/2uk9v///////////////////////////////////////////////////////f392P39/Zn/////ks/7/zdS7P84Rur/0NT6///////////////////////9/f////////////////////////39/Zb+/v4y//////n5/v9WYu3/NUPq/ztJ6/+VnPT/z9L6/9HU+v+WnfT/Ul7t/+Hj/P////////////////////8wAAAAAP39/Z3/////6Or9/1hj7v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v9sdvD////////////9/f2YAAAAAAAAAAD///8K/f39w//////5+f7/paz2/11p7v88Suv/Okfq/1pm7v+iqfX/+fn+///////9/f3B/v7+CQAAAAAAAAAAAAAAAP///wr9/f2d///////////////////////////////////////////9/f2Z/v7+CQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/jL9/f2Z/f392/39/fr9/f36/f392v39/Zj///8wAAAAAAAAAAAAAAAAAAAAAPAPAADAAwAAgAEAAIABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAACAAQAAwAMAAPAPAAAoAAAAIAAAAEAAAAABACAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/g3+/v5X/f39mf39/cj9/f3q/f39+f39/fn9/f3q/f39yP39/Zn+/v5W////DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/iT9/f2c/f399f/////////////////////////////////////////////////////9/f31/f39mv7+/iMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/gn9/f2K/f39+////////////////////////////////////////////////////////////////////////////f39+v39/Yf///8IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v4k/f390v////////////////////////////////////////////////////////////////////////////////////////////////39/dD///8iAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////MP39/er//////////////////////////+r05v+v16H/gsBs/2WxSf9Wqjj/Vqk3/2OwRv99vWX/pdKV/97u2P////////////////////////////39/ej+/v4vAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/iT9/f3q/////////////////////+v15/+Pxnv/VKk2/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/36+Z//d7tf///////////////////////39/ej///8iAAAAAAAAAAAAAAAAAAAAAAAAAAD///8K/f390//////////////////////E4bn/XKw+/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1apN/+x0pv///////////////////////39/dD///8IAAAAAAAAAAAAAAAAAAAAAP39/Yv/////////////////////sdij/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/YKU1/8qOPv/5wZ////////////////////////39/YcAAAAAAAAAAAAAAAD+/v4l/f39+////////////////8Lgt/9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9utlT/n86N/7faqv+426v/pdKV/3u8ZP9UqDX/U6g0/3egN//jiUH/9IVC//SFQv/82MP//////////////////f39+v7+/iMAAAAAAAAAAP39/Z3////////////////q9Ob/W6w+/1OoNP9TqDT/U6g0/1OoNP9nskz/zOXC/////////////////////////////////+Dv2v+osWP/8YVC//SFQv/0hUL/9IVC//WQVP/++fb//////////////////f39mgAAAAD+/v4O/f399v///////////////4LHj/9TqDT/U6g0/1OoNP9TqDT/dblc//L58P/////////////////////////////////////////////8+v/3p3f/9IVC//SFQv/0hUL/9IVC//rIqf/////////////////9/f31////DP7+/ln////////////////f9v7/Cbz2/zOwhv9TqDT/U6g0/2KwRv/v9+z///////////////////////////////////////////////////////738//1kFT/9IVC//SFQv/0hUL/9plg///////////////////////+/v5W/f39nP///////////////4jf/f8FvPv/Bbz7/yG1s/9QqDz/vN2w//////////////////////////////////////////////////////////////////rHqP/0hUL/9IVC//SFQv/0hUL//vDn//////////////////39/Zn9/f3L////////////////R878/wW8+/8FvPv/Bbz7/y7C5P/7/fr//////////////////////////////////////////////////////////////////ere//SFQv/0hUL/9IVC//SFQv/718H//////////////////f39yP39/ez///////////////8cwvv/Bbz7/wW8+/8FvPv/WNL8///////////////////////////////////////0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//rIqv/////////////////9/f3q/f39+v///////////////we9+/8FvPv/Bbz7/wW8+/993P3///////////////////////////////////////SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/+cGf//////////////////39/fn9/f36////////////////B737/wW8+/8FvPv/Bbz7/33c/f//////////////////////////////////////9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/6xaX//////////////////f39+f39/e3///////////////8cwvv/Bbz7/wW8+/8FvPv/WdP8///////////////////////////////////////0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//vVv//////////////////9/f3q/f39y////////////////0bN/P8FvPv/Bbz7/wW8+/8hrvn/+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////39/cj9/f2c////////////////ht/9/wW8+/8FvPv/FZP1/zRJ6/+zuPf//////////////////////////////////////////////////////////////////////////////////////////////////////////////////f39mf7+/lr////////////////d9v7/B7n7/yB38f81Q+r/NUPq/0hV7P/u8P3////////////////////////////////////////////////////////////////////////////////////////////////////////////+/v5X////D/39/ff///////////////9tkPT/NUPq/zVD6v81Q+r/NUPq/2Fs7//y8v7////////////////////////////////////////////09f7//////////////////////////////////////////////////f399f7+/g0AAAAA/f39n////////////////+Tm/P89Suv/NUPq/zVD6v81Q+r/NUPq/1Bc7f/IzPn/////////////////////////////////x8v5/0xY7P+MlPP////////////////////////////////////////////9/f2cAAAAAAAAAAD+/v4n/f39/P///////////////7W69/81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v9ZZe7/k5v0/6609/+vtff/lJv0/1pm7v81Q+r/NUPq/zVD6v+GjvL//v7//////////////////////////////f39+/7+/iQAAAAAAAAAAAAAAAD9/f2N/////////////////////6Cn9f81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v+BivL////////////////////////////9/f2KAAAAAAAAAAAAAAAAAAAAAP7+/gv9/f3V/////////////////////7W69/8+S+v/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/P0zr/7q/+P///////////////////////f390v7+/gkAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/ib9/f3r/////////////////////+Xn/P94gfH/NkTq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NkTq/3Z/8f/l5/z///////////////////////39/er+/v4kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/jL9/f3r///////////////////////////k5vz/nqX1/2p08P9IVez/OEbq/zdF6v9GU+z/aHLv/5qh9f/i5Pz////////////////////////////9/f3q////MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/ib9/f3V/////////////////////////////////////////////////////////////////////////////////////////////////f390v7+/iQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wr9/f2N/f39/P///////////////////////////////////////////////////////////////////////////f39+/39/Yv+/v4JAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v4n/f39n/39/ff//////////////////////////////////////////////////////f399v39/Z3+/v4lAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v7+Dv7+/lr9/f2c/f39y/39/e39/f36/f39+v39/ez9/f3L/f39nP7+/ln+/v4OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AA///AAD//AAAP/gAAB/wAAAP4AAAB8AAAAPAAAADgAAAAYAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAABgAAAAcAAAAPAAAAD4AAAB/AAAA/4AAAf/AAAP/8AAP//wAP/) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });
  });

  describe('in stream mode', function () {
    it('should throw a PluginError', function (done) {
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
                  if (err instanceof Error && err.message === 'Stream not supported!') {
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

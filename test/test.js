var assert = require('assert');
var es = require('event-stream');
var gutil = require('gulp-util');
var base64 = require("../src/index");

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  })
});

describe('gulp-css-base64', function() {

    // define here beforeEach(), afterEach()

    describe('in buffer mode', function() {
        it('should work with cleanicons', function(done) {

            // create the fake file
            var fakeFile = new gutil.File({
                cwd: './',
                base: './',
                path: './fixtures/css/file.css',
                contents: new Buffer('.button_alert{background:url(../image/very-very-small.png) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
            });

            // Create a prefixer plugin stream
            var myPrefixer = base64('prependthis');

            // write the fake file to it
            myPrefixer.write(fakeFile);

            // wait for the file to come back out
            myPrefixer.once('data', function(file) {
                // make sure it came out the same way it went in
                assert(file.isBuffer());

                // check the contents
                assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANAQAAAABakNnRAAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAEgAAABIAEbJaz4AAAArSURBVAjXY/j/g2H/C4b5Jxj6OxgaOEBoxgmGDg8GIACyuRoYjkowfKgAACBpDLQ2kvRRAAAAAElFTkSuQmCC) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
                done();
            });

        });

    });

    describe('in stream mode', function() {

    });

    describe('with null contents', function() {

    });

});

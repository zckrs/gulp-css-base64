var assert = require("assert");
var base64 = require("../src/index");
var gutil = require('gulp-util');

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
    it('should work in buffer mode', function(done) {
        var stream = base64();
        var fakeBuffer = new Buffer("wadup");
        var fakeFile = new gutil.File({
            contents: fakeBuffer
        });

        var fakeBuffer2 = new Buffer("doe");
        var fakeFile2 = new gutil.File({
            contents: fakeBuffer2
        });

        stream.on('data', function(newFile) {
            if (newFile === fakeFile) {
                assert.equal(fakeBuffer, newFile.contents);
            } else {
                assert.equal(fakeBuffer2, newFile.contents);
            }
        });

        stream.on('end', function() {
            done();
        });

        stream.write(fakeFile);
        stream.write(fakeFile2);
        stream.end();
    });
  })
})

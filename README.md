# gulp-css-base64

[![Build Status](http://img.shields.io/travis/zckrs/gulp-css-base64.svg?style=flat)](https://travis-ci.org/zckrs/gulp-css-base64) [![Coverage Status](http://img.shields.io/coveralls/zckrs/gulp-css-base64.svg?style=flat)](https://coveralls.io/r/zckrs/gulp-css-base64?branch=master) [![NPM Version](http://img.shields.io/npm/v/gulp-css-base64.svg?style=flat)](https://www.npmjs.org/package/gulp-css-base64) [![Download Month](http://img.shields.io/npm/dm/gulp-css-base64.svg?style=flat)](https://www.npmjs.org/package/gulp-css-base64)

This gulp task converts all data found within a stylesheet (those within a url( ... ) declaration) into base64-encoded data URI strings. This includes images and fonts.

Inspired by [grunt-image-embed](https://github.com/ehynds/grunt-image-embed) and written following [gulp's guidelines](https://github.com/gulpjs/gulp/tree/master/docs/writing-a-plugin).

## Features

* Supports local and remote resources.
* Supports buffer (and stream **WIP**).
* [[>]](#optionsverbose) Ability to enable verbose mode with debugs messages. Default is unable.
* [[>]](#optionspreprocess) Ability to use a pre-process function for each resource find in CSS. Default there is no function.
* [[>]](#optionsbasedir) Ability to define a relative base directory to gulpfile.js. Default is the current directory.
* [[>]](#optionsdeleteafterencoding) Ability to remove a local resource after encoding. Default is unable.
* [[>]](#optionsmaxweightresource) Ability to specify a weight limit. Default is 32kB which is IE8's limit.
* [[>]](#optionsextensionsallowed) Ability to filter on file extensions. Default there is no filter.
* [[>]](#ignore-a-specific-resource) Ignore a resource by specifying a directive comment in CSS.
* Existing data URIs will be ignored.
* Existing SVG masks will be ignored.

## Install

Install this plugin with the command:

```js
npm install --save-dev gulp-css-base64
```

## Usage

```js
var cssBase64 = require('gulp-css-base64');

//Without options
gulp.task('default', function () {
    return gulp.src('src/css/input.css')
        .pipe(cssBase64())
        .pipe(gulp.dest('dist'));
});

//With options
gulp.task('default', function () {
    return gulp.src('src/css/input.css')
        .pipe(cssBase64({
            verbose: true
            baseDir: "../../images",
            maxWeightResource: 100,
            extensionsAllowed: ['.gif', '.jpg']
        }))
        .pipe(gulp.dest('dist'));
});
```

## Options

#### options.verbose
Type: `Boolean`

Default value: `false`

Note: Writes in stdout for more infos on process. (Resource ignored, fetch remote resource, etc)

#### options.preProcess
Type: `Function(vinylFile, callback)`

Default value: ``

Note: Vinyl is a virtual file format. See [description](https://github.com/wearefractal/vinyl#file)

Example:
```js
// Apply a rotation on each PNG image with NPM library http://aheckmann.github.io/gm/
var gm = require('gm').subClass({
    imageMagick: true
});
[...]
        .pipe(cssBase64({
            preProcess : function(vinylFile, callback) {
                if ('image/png' === mime.lookup(vinylFile.path)) {
                    gm(vinylFile.path).rotate('green', 180).toBuffer(function (err, buffer) {
                        vinylFile.contents = buffer;
                        return callback(vinylFile);
                    })
                }
            }
        }))
[...]

```

#### options.baseDir
Type: `String`

Default value: ``

Note: If you have absolute image paths in your stylesheet, the path specified in this option will be used as the base directory. By default plugin used the current directory of gulpfile.js to find local resources.

#### options.deleteAfterEncoding
Type: `Boolean`

Default value: `false`

Note: Delete a local source file after encoding.

#### options.maxWeightResource
Type: `Number`

Default value: `32768`

#### options.extensionsAllowed
Type: `Array`

Default value: `[]`

## Ignore a specific resource

You can ignore a resource with a comment `/*base64:skip*/` in CSS file after url definition.
```css
.ignored{
  background: url(image.png); /*base64:skip*/
}
.encoded{
  background: url(image.jpg);
}
```

## License
Copyright (c) 2014 [Mehdy Dara](https://github.com/zckrs) under the MIT License.

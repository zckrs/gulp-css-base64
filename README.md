# gulp-css-base64 [![Build Status](https://travis-ci.org/zckrs/gulp-css-base64.svg?branch=master)](https://travis-ci.org/zckrs/gulp-css-base64) [![Coverage Status](https://coveralls.io/repos/zckrs/gulp-css-base64/badge.png?branch=master)](https://coveralls.io/r/zckrs/gulp-css-base64?branch=master)

This gulp task converts all data found within a stylesheet (those within a url( ... ) declaration) into base64-encoded data URI strings. This includes images and fonts.

Inspired by [grunt-image-embed](https://github.com/ehynds/grunt-image-embed) and written following [gulp's guidelines](https://github.com/gulpjs/gulp/tree/master/docs/writing-a-plugin).

## Features

* Supports local and remote resources.
* Supports buffer (and stream **WIP**).
* Ability to define a relative base directory to gulpfile.js. Default is the current directory. [Details](#optionsbasedir)
* Ability to remove a local resource after encoding. Default is unable. [Details](#optionsdeleteafterencoding)
* Ability to specify a weight limit. Default is 32kB which is IE8's limit. [Details](#optionsmaxweightresource)
* Ability to filter on file extensions. Default there is no filter. [Details](#optionsextensionsallowed)
* Ignore a resource by specifying a directive comment in CSS. [Details](#ignore-a-specific-resource)
* Existing data URIs will be ignored.

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
            baseDir: "../../images",
            maxWeightResource: 100,
            extensionsAllowed: ['.gif', '.jpg']
        }))
        .pipe(gulp.dest('dist'));
});
```

## Options

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

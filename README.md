# gulp-css-base64 [![Build Status](https://travis-ci.org/zckrs/gulp-css-base64.svg?branch=master)](https://travis-ci.org/zckrs/gulp-css-base64) [![Coverage Status](https://coveralls.io/repos/zckrs/gulp-css-base64/badge.png?branch=master)](https://coveralls.io/r/zckrs/gulp-css-base64?branch=master)

This gulp task converts all data found within a stylesheet (those within a url( ... ) declaration) into base64-encoded data URI strings. This includes images and fonts.

Inspired by [grunt-image-embed](https://github.com/ehynds/grunt-image-embed) and written following [gulp's guidelines](https://github.com/gulpjs/gulp/tree/master/docs/writing-a-plugin).

## Features

* Supports local resource (remote **WIP**).
* Supports buffer (and stream **WIP**).
* Ability to specify a weight limit. Default is 32kB which is IE8's limit.
* Ability to filter on file extensions. Default there is no filter.
* (Ability to define a base directory. **WIP**)
* Existing data URIs will be ignored.
* (Skip specific images by specifying a directive comment. **WIP**)

## Install

Install this plugin with the command:

```js
npm install --save-dev gulp-css-base64
```

## Usage

```js
var cssBase64 = require('gulp-css-base64');

gulp.task('default', function () {
    return gulp.src('src/css/input.css')
        .pipe(cssBase64())
        .pipe(gulp.dest('dist'));
});
```

### Options

#### options.maxWeightResource
Type: `Number`
Default value: `32768`

#### options.extensionsAllowed
Type: `Array`
Default value: `[]`

## License
Copyright (c) 2014 [Mehdy Dara](https://github.com/zckrs) under the MIT License.

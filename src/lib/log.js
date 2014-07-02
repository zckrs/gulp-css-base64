var util = require('util');
var chalk = require('chalk');
var date = require('dateformat');

module.exports = function () {
    if (process.env.NODE_ENV === 'test') {
        return ;
    }

    var time = '[' + chalk.grey(date(new Date(), 'HH:MM:ss')) + ']';
    var sig = '[' + chalk.green('gulp-css-base64') + ']';
    var args = Array.prototype.slice.call(arguments);
    args.unshift(sig);
    args.unshift(time);
    console.log.apply(console, args);

    return this;
};

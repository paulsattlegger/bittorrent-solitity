var express = require('express');
var logger = require('morgan');

var indexRouter = require('./routes');

var app = express();

app.use(logger('dev'));

app.use('/', indexRouter);

module.exports = app;

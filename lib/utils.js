var url = require('url');
var util = require('util');

var _ = require('lodash');
var S = require('string');
var debug = require('debug')('yahoo-finance:utils');
var Promise = require('bluebird');
var request = require('request');
var moment = require('moment');
var dateFormats = ['YYYY-MM-DD', 'MM/DD/YYYY'];

request = Promise.promisifyAll(request);

function camelize(text) {
  return S(text)
    .slugify()
    .camelize()
    .s;
}

function download(uri, qs) {
  debug(url.format({pathname: uri, query: qs}));
  return request.getAsync({
    uri: uri,
    qs: qs
  }).spread(function (res, body) {
    if (res.statusCode === 200) {
      return body;
    } else {
      throw new Error(util.format('status %d', res.statusCode));
    }
  });
}

function parseCSV(text) {
  return S(text).trim().s.split('\n').map(function (line) {
    return S(line).trim().parseCSV();
  });
}

function toDate(value, valueForError) {
  try {
    var date = moment(value, dateFormats).toDate();
    if (date.getFullYear() < 1400) { return null; }
    return date;
  } catch (err) {
    if (_.isUndefined(valueForError)) {
      return null;
    } else {
      return valueForError;
    }
  }
}

function toFloat(value, valueForNaN) {
  var result = parseFloat(value);
  if (isNaN(result)) {
    if (_.isUndefined(valueForNaN)) {
      return null;
    } else {
      return valueForNaN;
    }
  } else  {
    return result;
  }
}

function toInt(value, valueForNaN) {
  var result = parseInt(value, 10);
  if (isNaN(result)) {
    if (_.isUndefined(valueForNaN)) {
      return null;
    } else {
      return valueForNaN;
    }
  } else  {
    return result;
  }
}

exports.camelize = camelize;
exports.download = download;
exports.parseCSV = parseCSV;
exports.toDate = toDate;
exports.toFloat = toFloat;
exports.toInt = toInt;

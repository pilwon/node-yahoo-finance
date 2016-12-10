var url = require('url');
var util = require('util');

var _ = require('lodash');
var S = require('string');
var debug = require('debug')('yahoo-finance:utils');
var request = require('request-promise');
var moment = require('moment-timezone');
var dateFormats = ['YYYY-MM-DD', 'MM/DD/YYYY'];

function camelize(text) {
  return S(text)
    .slugify()
    .camelize()
    .s;
}

function download(uri, qs, optionalHttpRequestOptions) {
  debug(url.format({pathname: uri, query: qs}));
  return request(_.extend({uri: uri, qs: qs}, optionalHttpRequestOptions));
}

function parseCSV(text) {
  return S(text).trim().s.split('\n').map(function (line) {
    return S(line).trim().parseCSV();
  });
}

function toDate(value, valueForError) {
  try {
    var date = moment.tz(value, dateFormats, 'America/New_York').toDate();
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

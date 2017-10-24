var url = require('url');
var util = require('util');

var _ = require('lodash');
var S = require('string');
var debug = require('debug')('yahoo-finance:utils');
var request = require('request-promise');
var moment = require('moment-timezone');
var tough = require('tough-cookie');

var Cookie = tough.Cookie;
var dateFormats = ['YYYY-MM-DD', 'MM/DD/YYYY'];
var cookiejar = new request.jar();

function camelize(text) {
  return S(text)
    .slugify()
    .camelize()
    .s;
}

function augmentHttpRequestOptions(optionalOptions) {
  if (optionalOptions && optionalOptions.jar)
    throw new Error("node-yahoo-finance does not support 'jar' key in " +
      "optionalHttpRequestOptions, since we need to use our own cookiejar.");

  return _.assign({}, optionalOptions, {
    resolveWithFullResponse: true,
    jar: cookiejar
  });
}

function storeCookiesInJar(setCookieHeader, url, cookiejar) {
  var cookies;

  if (typeof setCookieHeader === 'undefined') {
    // no-op
  } else if (setCookieHeader instanceof Array) {
    cookies = setCookieHeader.map(Cookie.parse);
  } else if (typeof setCookieHeader === 'string') {
    cookies = [ Cookie.parse(setCookieHeader) ];
  }

  if (cookies)
  for (var i=0; i < cookies.length; i++) {
    // note: async, possible timing issues? TODO
    cookiejar.setCookie(''+cookies[i], url);
  }
}

function download(uri, qs, optionalHttpRequestOptions) {
  var finalHttpRequestOptions = augmentHttpRequestOptions(optionalHttpRequestOptions);

  debug(url.format({pathname: uri, query: qs}));
  return request(_.extend({uri: uri, qs: qs}, finalHttpRequestOptions))
    .then(function(res) {
      storeCookiesInJar(res.headers['set-cookie'], uri, cookiejar);
      return (optionalHttpRequestOptions &&
        optionalHttpRequestOptions.resolveWithFullResponse) ? res : res.body;
    });
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

exports.cookiejar = cookiejar;
exports.camelize = camelize;
exports.download = download;
exports.parseCSV = parseCSV;
exports.toDate = toDate;
exports.toFloat = toFloat;
exports.toInt = toInt;

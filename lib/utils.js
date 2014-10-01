var url = require('url');
var util = require('util');

var S = require('string');
var debug = require('debug')('yahoo-finance:utils');
var Promise = require('bluebird');
var request = require('request');

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

exports.camelize = camelize;
exports.download = download;
exports.parseCSV = parseCSV;

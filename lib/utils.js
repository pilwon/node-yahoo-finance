var url = require('url');
var util = require('util');

var S = require('string');
var debug = require('debug')('yahoo-finance:utils');
var csv = require('csv');
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
  return new Promise(function (resolve) {
    csv().from.string(text).to.array(resolve);
  });
}

exports.camelize = camelize;
exports.download = download;
exports.parseCSV = parseCSV;

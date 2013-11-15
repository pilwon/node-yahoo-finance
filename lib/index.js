/*
 * lib/index.js
 */

'use strict';

var assert = require('assert'),
    querystring = require('querystring'),
    util = require('util');

var _ = require('lodash'),
    async = require('async'),
    csv = require('csv'),
    moment = require('moment'),
    request = require('request');

function _assert(options) {
  assert(_.isPlainObject(options),
         '"options" must be a plain object.');
  assert(!_.isUndefined(options.symbol) || !_.isUndefined(options.symbols),
         'Either "options.symbol" or "options.symbols" must be defined.');
  assert(_.isUndefined(options.symbol) || _.isUndefined(options.symbols),
         'Either "options.symbol" or "options.symbols" must be undefined.');

  if (!_.isUndefined(options.symbol)) {
    assert((_.isString(options.symbol) && !_.isEmpty(options.symbol)),
           '"options.symbol" must be a non-empty string.');
  } else {
    assert((_.isArray(options.symbols) && !_.isEmpty(options.symbols)),
           '"options.symbols" must be a non-empty array.');
  }
}

function historical(options, cb) {
  if (_.isUndefined(options)) { options = {}; }

  _assert(options);

  var symbols = options.symbols || [options.symbol];

  async.map(symbols, function (symbol, cb) {
    var today = moment();

    var url = 'http://ichart.finance.yahoo.com/table.csv?' + querystring.stringify({
      s: symbol,
      a: 1,
      b: 1,
      c: 1900,
      d: today.format('MM'),
      e: today.format('DD'),
      f: today.format('YYYY'),
      g: 'd',
      ignore: '.csv'
    });

    request({
      url: url
    }, function (err, res, body) {
      if (err) { return cb(err); }

      switch (res.statusCode) {
      case 200:
        csv().from.string(body).to.array(function (data) {
          var headings = data.shift();

          var quotes = _.map(data.reverse(), function (line) {
            var result = {};

            headings.forEach(function (heading, i) {
              var value = line[i];

              if (_.contains(['Volume'], heading)) {
                value = parseInt(value, 10);
              } else if (_.contains(['Open', 'High', 'Low', 'Close', 'Adj Close'], heading)) {
                value = parseFloat(value);
              } else if (_.contains(['Date'], heading)) {
                value = moment(value).toDate();
              }

              result[heading.replace(/ /g, '')] = value;
            });

            result.Symbol = symbol;

            return result;
          });

          cb(null, {
            quotes: quotes,
            url: url,
            symbol: symbol
          });
        });
        break;
      default:
        cb(new Error(util.format('Failed to download csv. (code=%d)', res.statusCode)));
      }
    });
  }, function (err, results) {
    if (err) { return cb(err); }

    if (options.symbol) {
      return cb(null, results[0].quotes, results[0].url, results[0].symbol);
    }

    cb(null, results);
  });
}

function snapshot(options, cb) {
  if (_.isUndefined(options)) { options = {}; }

  _assert(options);

  if (options.symbol) {
    options.symbols = [options.symbol];
  }

  cb(new Error('Not yet implemented.'));
}

// Public API
exports.historical = historical;
exports.snapshot = snapshot;

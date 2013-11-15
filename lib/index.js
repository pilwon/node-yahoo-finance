/*
 * lib/index.js
 */

'use strict';

var assert = require('assert'),
    querystring = require('querystring'),
    util = require('util');

var _ = require('lodash'),
    S = require('string'),
    async = require('async'),
    csv = require('csv'),
    moment = require('moment'),
    request = require('request');

var FIELD = {
  s: 'Symbol',

  // Pricing
  a: 'Ask',
  b: 'Bid',
  b2: 'Ask (Realtime)',
  b3: 'Bid (Realtime)',
  p: 'Previous Close',
  o: 'Open',

  // Dividends
  y: 'Dividend Yield',
  d: 'Dividend Per Share',
  r1: 'Dividend Pay Date',
  q: 'Ex-Dividend Date',

  // Date
  c1: 'Change',
  c: 'Change And Percent Change',
  c6: 'Change (Realtime)',
  k2: 'Change Percent (Realtime)',
  p2: 'Change in Percent',
  d1: 'Last Trade Date',
  d2: 'Trade Date',
  t1: 'Last Trade Time',

  // Averages
  c8: 'After Hours Change (Realtime)',
  c3: 'Commission',
  g: 'Day’s Low',
  h: 'Day’s High',
  k1: 'Last Trade (Realtime) With Time',
  l: 'Last Trade (With Time)',
  l1: 'Last Trade (Price Only)',
  t8: '1 yr Target Price',
  m5: 'Change From 200-day Moving Average',
  m6: 'Percent Change From 200-day Moving Average',
  m7: 'Change From 50-day Moving Average',
  m8: 'Percent Change From 50-day Moving Average',
  m3: '50-day Moving Average',
  m4: '200-day Moving Average',

  // Misc
  w1: 'Day’s Value Change',
  w4: 'Day’s Value Change (Realtime)',
  p1: 'Price Paid',
  m: 'Day’s Range',
  m2: 'Day’s Range (Realtime)',
  g1: 'Holdings Gain Percent',
  g3: 'Annualized Gain',
  g4: 'Holdings Gain',
  g5: 'Holdings Gain Percent (Realtime)',
  g6: 'Holdings Gain (Realtime)',

  // 52 Week Pricing
  k: '52-week High',
  j: '52-week Low',
  j5: 'Change From 52-week Low',
  k4: 'Change From 52-week High',
  j6: 'Percent Change From 52-week Low',
  k5: 'Percebt Change From 52-week High',
  w: '52-week Range',

  // System Info
  i: 'More Info',
  j1: 'Market Capitalization',
  j3: 'Market Cap (Realtime)',
  f6: 'Float Shares',
  n: 'Name',
  n4: 'Notes',
  s1: 'Shares Owned',
  x: 'Stock Exchange',
  j2: 'Shares Outstanding',

  // Volume
  v: 'Volume',
  a5: 'Ask Size',
  b6: 'Bid Size',
  k3: 'Last Trade Size',
  a2: 'Average Daily Volume',

  // Ratio
  e: 'Earnings Per Share',
  e7: 'EPS Estimate Current Year',
  e8: 'EPS Estimate Next Year',
  e9: 'EPS Estimate Next Quarter',
  b4: 'Book Value',
  j4: 'EBITDA',
  p5: 'Price per Sales',
  p6: 'Price per Book',
  r: 'PE Ratio',
  r2: 'PE Ratio (Realtime)',
  r5: 'PEG Ratio',
  r6: 'Price Per EPS Estimate Current Year',
  r7: 'Price Per EPS Estimate Next Year',
  s7: 'Short Ratio',

  // Misc
  t7: 'Ticker Trend',
  t6: 'Trade Links',
  i5: 'Order Book (Realtime)',
  l2: 'High Limit',
  l3: 'Low Limit',
  v1: 'Holdings Value',
  v7: 'Holdings Value (Realtime)',
  s6: 'Revenue',
  e1: 'Error Indication (returned for symbol changed or invalid)'
};

function _camelize(text) {
  return S(text)
    .slugify()
    .camelize()
    .s;
}

function historical(options, cb) {
  if (_.isUndefined(options)) { options = {}; }

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
           '"options.symbols" must be a non-empty string array.');
  }

  if (_.isString(options.from) && !_.isEmpty(options.from)) {
    options.from = moment(options.from);
    assert(options.from.isValid(), '"options.from" must be a valid date string.');
  } else {
    assert(_.isDate(options.from) || _.isUndefined(options.from) || _.isNull(options.from),
           '"options.from" must be a date or undefined/null.');
    if (_.isDate(options.from)) {
      options.from = moment(options.from);
    }
  }

  if (_.isString(options.to) && !_.isEmpty(options.to)) {
    options.to = moment(options.to);
    assert(options.to.isValid(), '"options.to" must be a valid date string.');
  } else {
    assert(_.isDate(options.to) || _.isUndefined(options.to) || _.isNull(options.to),
           '"options.to" must be a date or undefined/null.');
    if (_.isDate(options.to)) {
      options.to = moment(options.to);
    }
  }

  if (!options.from) {
    options.from = moment('1900-01-01');
  }

  if (!options.to) {
    options.to = moment({ hour: 0 });
  }

  assert((!options.from && !options.to) || !options.from.isAfter(options.to),
         '"options.to" must be be greater than or equal to "options.from".');

  var symbols = options.symbols || [options.symbol];

  async.map(symbols, function (symbol, cb) {
    var url = 'http://ichart.finance.yahoo.com/table.csv?' + querystring.stringify({
      s: symbol,
      a: options.from.format('MM') - 1,
      b: options.from.format('DD'),
      c: options.from.format('YYYY'),
      d: options.to.format('MM') - 1,
      e: options.to.format('DD'),
      f: options.to.format('YYYY'),
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

              result[_camelize(heading)] = value;
            });

            result.symbol = symbol;

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
        cb(new Error(util.format('Failed to download csv (code=%d): %s', res.statusCode, url)));
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

  assert(_.isPlainObject(options),
         '"options" must be a plain object.');
  assert(_.isArray(options.symbols) && !_.isEmpty(options.symbols),
         '"options.symbols" must be a non-empty string array.');
  assert((_.isArray(options.fields) && !_.isEmpty(options.fields)) || _.isUndefined(options.fields),
         '"options.fields" must be a non-empty string array or undefined.');

  if (!options.fields) {
    options.fields = _.keys(FIELD);  // fetch all fields if undefined
  }

  // Avoid CSV column result mis-alignment (000,000,000).
  options.fields = _.without(options.fields, 't6', 'j1', 'j3', 'f6', 'j2', 'v', 'a5', 'b6', 'k3');

  var url = 'http://download.finance.yahoo.com/d/quotes.csv?' + querystring.stringify({
    s: options.symbols.join(','),
    f: options.fields.join('')
  });

  request({
    url: url
  }, function (err, res, body) {
    if (err) { return cb(err); }

    switch (res.statusCode) {
    case 200:
      csv().from.string(body).to.array(function (data) {
        var items = _.map(data, function (line, i) {
          var result = {},
              symbol = options.symbols[i],
              lineIdx = 0,
              field,
              fieldIdx,
              value;

          for (fieldIdx = 0; fieldIdx < options.fields.length; ++fieldIdx) {
            field = options.fields[fieldIdx];
            value = line[lineIdx++];

            // Manual type conversion
            // if (_.contains([], field)) {
            //   value = parseInt(value, 10);
            // } else if (_.contains(['a', 'b', 'b2', 'b3', 'p', 'o'], field)) {
            //   value = parseFloat(value);
            // } else if (_.contains([], field)) {
            //   value = moment(value).toDate();
            // }

            result[_camelize(FIELD[field])] = value;
          }

          assert(line.length === lineIdx, 'CSV column mis-alignment error');

          result.symbol = symbol;

          return result;
        });

        data = {};

        _.each(items, function (item) {
          data[item.symbol] = item;
        });

        cb(null, data, url, options.fields);
      });
      break;
    default:
      cb(new Error(util.format('Failed to download csv. (code=%d)', res.statusCode)));
    }
  });
}

// Public API
exports.historical = historical;
exports.snapshot = snapshot;

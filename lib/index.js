var assert = require('assert');
var querystring = require('querystring');
var util = require('util');

var _ = require('lodash');
var async = require('async');
var csv = require('csv');
var moment = require('moment');
var request = require('request');

var _fields = require('./fields');
var _utils = require('./utils');

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

  if (_.isString(options.period)) {
    assert(_.contains(['d', 'w', 'm', 'v'], options.period), '"options.period" must be "d", "w", "m", or "v".');
  } else {
    assert(_.isUndefined(options.period) || _.isNull(options.period),
           '"options.period" must be a string or undefined/null.');
  }

  if (!options.from) {
    options.from = moment('1900-01-01');
  }

  if (!options.to) {
    options.to = moment({ hour: 0 });
  }

  if (!options.period) {
    options.period = 'd';
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
      g: options.period,
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
              } else if (_.contains(['Open', 'High', 'Low', 'Close', 'Adj Close', 'Dividends'], heading)) {
                value = parseFloat(value);
              } else if (_.contains(['Date'], heading)) {
                value = moment(value).toDate();
              }

              result[_utils.camelize(heading)] = value;
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
    options.fields = _.keys(_fields);  // fetch all fields if undefined
  }

  // Avoid CSV column result mis-alignment (000,000,000).
  options.fields = _.without(options.fields, 't6', 'f6', 'j2', 'a5', 'b6', 'k3');

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
        var err;
        var items = _.map(data, function (line, i) {
          var result = {};
          var symbol = options.symbols[i];
          var lineIdx = 0;
          var field;
          var fieldIdx;
          var value;

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

            result[_utils.camelize(_fields[field])] = value;
          }

          if (line.length !== lineIdx) {
            err = new Error('CSV column mis-alignment error');
          }

          result.symbol = symbol;

          return result;
        });

        if (err) { return cb(err); }

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

exports.historical = historical;
exports.snapshot = snapshot;

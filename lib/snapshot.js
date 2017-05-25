var os = require('os');
var util = require('util');

var _ = require('lodash');
var S = require('string');
var moment = require('moment');
var Promise = require('bluebird');

var _constants = require('./constants');
var _fields = require('./fields');
var _utils = require('./utils');
var getCrumb = require('./yahooCrumb').getCrumb;

function _sanitizeSnapshotOptions(options) {
  if (!_.isPlainObject(options)) {
    throw new Error('"options" must be a plain object.');
  }
  if (_.isUndefined(options.symbol) && _.isUndefined(options.symbols)) {
    throw new Error('Either "options.symbol" or "options.symbols" must be defined.');
  }
  if (!_.isUndefined(options.symbol) && !_.isUndefined(options.symbols)) {
    throw new Error('Either "options.symbol" or "options.symbols" must be undefined.');
  }

  if (!_.isUndefined(options.symbol)) {
    if (!_.isString(options.symbol) || _.isEmpty(options.symbol)) {
      throw new Error('"options.symbol" must be a non-empty string.');
    }
  } else {
    if (!_.isArray(options.symbols) || _.isEmpty(options.symbols)) {
      throw new Error('"options.symbols" must be a non-empty string array.');
    }
  }

  if ((!_.isArray(options.fields) || _.isEmpty(options.fields)) && !_.isUndefined(options.fields)) {
    throw new Error('"options.fields" must be a non-empty string array or undefined.');
  }

  if (!options.fields) {
    // fetch all fields if undefined
    options.fields = _.keys(_fields).sort();
  }

  // Avoid CSV column result mis-alignment (000,000,000).
  options.fields = _.without(options.fields, 't6', 'f6', 'j2', 'a5', 'b6', 'k3', 's6');

  // Ensure error field exists.
  options.fields = _.union(options.fields, ['e1']);
}

function _transformSnapshot(fields, symbols, data) {
  return _(data)
    .map(function (line, i) {
      var result = {
        symbol: symbols[i]
      };
      var lineIdx = 0;
      var field;
      var fieldIdx;
      var value;
      for (fieldIdx = 0; fieldIdx < fields.length; ++fieldIdx) {
        field = fields[fieldIdx];
        value = line[lineIdx++];
        value = S(value).chompLeft('N/A - ').s;
        if (_.includes(['-', '- - -', 'N/A'], value)) {
          value = null;
        }
        if (field === 'e1') {
          if (value) {
            return value;
          } else {
            continue;
          }
        }
        if (value && (S(value).startsWith('+') || S(value).startsWith('-')) && S(value).endsWith('%')) {
          value = _utils.toFloat(S(value).chompRight('%').s, null);
          if (value) {
            value /= 100;
          }
        }
        if (_.includes(['a2', 'v'], field)) {
          value = _utils.toInt(value, null);
        } else if (_.includes([
          'a', 'b', 'b2', 'b3', 'b4', 'c1', 'c6', 'd', 'e', 'e7', 'e8',
          'e9','g', 'h', 'j', 'j5', 'k', 'k4', 'l1', 'm3', 'm4', 'm5',
          'm7', 'o', 'p', 'p5', 'p6', 'r', 'r5', 'r6', 'r7', 't8', 'y'
        ], field)) {
          value = _utils.toFloat(value, null);
        } else if (_.includes(['d1'], field)) {
          value = _utils.toDate(value, null);
          if (value && !moment(value).isValid()) {
            value = null;
          }
        }
        result[_utils.camelize(_fields[field])] = value;
      }
      if (line.length !== lineIdx) {
        throw new Error('CSV column mis-alignment error');
      }
      return result;
    })
    .value();
}

function snapshot(options, optionalHttpRequestOptions, cb) {
  throw new Error("[yahoo-finance] snapshot() is not available in this " +
    "release.  Yahoo have completely changed their API recently.  In our " +
    "next release, we will have a compatibility-layer in place so that " +
    "snapshot()  works as expected for SOME options.  Unfortunately, Yahoo's " +
    "new API does not provide all the same data, so 100% compatibility is " +
    "impossible.  For this reason, please be advised that snapshot() is " +
    "DEPRECATED.  See our in-progress quote() API for an alternative.");

  var symbols = options.symbols || _.flatten([options.symbol]);
  options = _.clone(options);
  _sanitizeSnapshotOptions(options);

  if(optionalHttpRequestOptions && typeof optionalHttpRequestOptions == 'function') {
    cb = optionalHttpRequestOptions;
    optionalHttpRequestOptions = {};
  } else if (!optionalHttpRequestOptions) {
    optionalHttpRequestOptions = {};
  }

  optionalHttpRequestOptions.json = true;

  if (symbols.length > 1)
    throw new Error("TODO multi symbol support, requires multiple requests in new API");

  return getCrumb(symbols[0])
    .then(function(crumb) {
      var url = _constants.SNAPSHOT_URL.replace(/\$SYMBOL/, symbols[0]);
      return _utils.download(url, {
          // f: options.fields.join('')  TODO
          formatted: 'false',
          crumb: crumb,
          // summaryProfile,m financialData, recommendationTrend, upgradeDowngradeHistory
          // earnings, price, summaryDetail, defaultKeyStatistics, calendarEvents
          modules: 'price,summaryDetail',
          corsDomain: 'finance.yahoo.com'
        }, optionalHttpRequestOptions)
        .then(function(result) {
          var quoteSummary = result.quoteSummary;
          if (!quoteSummary || quoteSummary.error)
            throw new Error(quoteSummary.error);

          var result = quoteSummary.result;
          if (!_.isArray(result) || result.length > 1)
            throw new Error("quoteSummary format has changed, please report "
              + "this.");

          return result[0];
        })
        /*
        .then(_utils.parseCSV)
        .then(function (data) {
          return _transformSnapshot(options.fields, symbols, data);
        })
        */
        .then(function (results) {
          if (options.symbols) {
            // TODO
            return _(symbols)
              .zipObject(results)
              .filter(function (result) {
                return _.isPlainObject(result);
              })
              .value();
          } else if (_.isPlainObject(results)) {
            // TODO, return old format?
            return results;
          } else {
            throw new Error(results);
          }
        })
        .catch(function (err) {
          throw new Error(util.format('Failed to download data (%s)', err.message));
        })
        .nodeify(cb);
    });
}

module.exports = snapshot;

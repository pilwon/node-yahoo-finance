var os = require('os');
var util = require('util');

var _ = require('lodash');
var Promise = require('bluebird');

var _constants = require('./constants');
var _utils = require('./utils');
var getCrumb = require('./yahooCrumb').getCrumb;

var validModules = [
  'summaryProfile', 'financialData', 'recommendationTrend',
  'upgradeDowngradeHistory', 'earnings', 'price', 'summaryDetail',
  'defaultKeyStatistics', 'calendarEvents'
];

var dateFields = {
  summaryDetail: [ 'exDividendDate' ],
  calendarEvents: [ 'exDividendDate', 'dividendDate' ],
  upgradeDowngradeHistory: [ 'history.epochGradeDate' ],
  price: [ 'preMarketTime', 'postMarketTime', 'regularMarketTime' ],
  defaultKeyStatistics: [
    'lastFiscalYearEnd', 'nextFiscalYearEnd',
    'mostRecentQuarter', 'lastSplitDate'
  ]
};

function _sanitizeQuoteOptions(options) {
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

  if (options.modules) {
    if (!_.isArray(options.modules))
      throw new Error('"options.modules" must be a non-empty string array or undefined.');
  } else {
    options.modules = ['price', 'summaryDetail'];
  }

  var invalid = _.difference(options.modules, validModules);
  if (invalid.length) {
    var available = _.difference(validModules, options.modules);
    throw new Error("[yahoo-finance] quote(): The following requested " +
      "modules do not exist: " + JSON.stringify(invalid) +
      ".  Did you mean one of: " + JSON.stringify(available) + "?");
  }
}

function transformDates(result) {
  _.each(_.keys(result), function(module) {
    _.each(dateFields[module], function(field) {

      if (field.indexOf('.') === -1) {

        if (result[module][field])
          result[module][field] = new Date(result[module][field] * 1000);

      } else {

        var parts = field.split('.');
        var arrayName = parts[0];
        var subField = parts[1];

        if (result[module][arrayName])
        _.each(result[module][arrayName], function(row) {
          if (row[subField])
            row[subField] = new Date(row[subField] * 1000);
        });

      }
    });
  });
  return result;
}

function quote(options, optionalHttpRequestOptions, cb) {
  if (_.isString(options)) {
    options = { symbol: options };
    if (_.isArray(optionalHttpRequestOptions)) {
      options.modules = optionalHttpRequestOptions;
      optionalHttpRequestOptions = undefined;
    }
  }

  var symbols = options.symbols || _.flatten([options.symbol]);
  options = _.clone(options);
  _sanitizeQuoteOptions(options);

  if(optionalHttpRequestOptions && typeof optionalHttpRequestOptions == 'function') {
    cb = optionalHttpRequestOptions;
    optionalHttpRequestOptions = {};
  } else if (!optionalHttpRequestOptions) {
    optionalHttpRequestOptions = {};
  }

  optionalHttpRequestOptions.json = true;

  return getCrumb(symbols[0])
    .then(function(crumb) {
      return Promise.map(symbols, function (symbol) {
        var url = _constants.SNAPSHOT_URL.replace(/\$SYMBOL/, symbol);
        return _utils.download(url, {
            formatted: 'false',
            crumb: crumb,
            modules: options.modules.join(','),
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
          .then(transformDates)
      }, {concurrency: options.maxConcurrentSymbols || os.cpus().length})
      .then(function (results) {
        if (options.symbols) {
          return _.zipObject(symbols, results);
        } else {
          return results[0];
        }
      })
      .catch(function (err) {
        throw new Error(util.format('Failed to download data (%s)', err.message));
      })
      .nodeify(cb);
    });
}

// API (ES6 syntax with default export)
exports.__esModule = true;
exports.default = quote;

// Used by snapshot
exports.dateFields = dateFields;

// For tests
exports._sanitizeQuoteOptions = _sanitizeQuoteOptions;

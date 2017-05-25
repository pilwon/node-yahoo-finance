var util = require('util');

var _ = require('lodash');

var _constants = require('./constants');
var _utils = require('./utils');
var getCrumb = require('./yahooCrumb').getCrumb;

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
  console.warn("[yahoo-finance] Warning, Yahoo completely changed their API " +
    "recently.  quote() replaces the deprecated snapshot(), but is brand " +
    "new.  Please report any issues.  This notice will be removed in the " +
    "next release.");

  if (_.isString(options)) {
    options = { symbol: options };
    if (_.isArray(optionalHttpRequestOptions)) {
      options.modules = optionalHttpRequestOptions;
      optionalHttpRequestOptions = undefined;
    }
  }

  var symbols = options.symbols || _.flatten([options.symbol]);
  options = _.clone(options);
  // _sanitizeSnapshotOptions(options);
  if (!options.modules)
    options.modules = ['price', 'summaryDetail']

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
          // summaryProfile, financialData, recommendationTrend, upgradeDowngradeHistory
          // earnings, price, summaryDetail, defaultKeyStatistics, calendarEvents
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
        /*
        .then(_utils.parseCSV)
        .then(function (data) {
          return _transformSnapshot(options.fields, symbols, data);
        })
        */
        .then(transformDates)
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

// API (ES6 syntax with default export)
exports.__esModule = true;
exports.default = quote;

// Used by snapshot
exports.dateFields = dateFields;

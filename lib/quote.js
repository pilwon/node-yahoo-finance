var _ = require('lodash');

var _cookies = require('./financeCookies');
var _constants = require('./constants');
var _utils = require('./utils');

function quote(options, optionalHttpRequestOptions, cb) {
  var symbols = options.symbols || _.flatten([options.symbol]);
  options = _.clone(options);
  // _sanitizeSnapshotOptions(options);
  if (!options.modules)
    options.modules = ['price', 'summaryDetail']

  if(optionalHttpRequestOptions && typeof optionalHttpRequestOptions == 'function') {
    cb = optionalHttpRequestOptions;
    optionalHttpRequestOptions = {};
  }

  optionalHttpRequestOptions.json = true;

  if (symbols.length > 1)
    throw new Error("TODO multi symbol support, requires multiple requests in new API");

  return _cookies.getCrumb(symbols[0])
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

module.exports = quote;

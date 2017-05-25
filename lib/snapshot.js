var os = require('os');
var util = require('util');

var _ = require('lodash');
var S = require('string');
var moment = require('moment');
var Promise = require('bluebird');

var _constants = require('./constants');
var _fields = require('./snapshotFields');
var _utils = require('./utils');
var getCrumb = require('./yahooCrumb').getCrumb;

var dateFields = require('./quote').dateFields;

var FIELDS_MAP_GITHUB_URL = 'https://github.com/pilwon/node-yahoo-finance/blob/master/lib/snapshotFields.js#L111';

// Fields from the old API that can be mapped to the current data
var mappedFields = _.filter(_.keys(_fields._map), function(field) {
  return !!_fields._map[field]
});

var requiredModuleForField = {};
_.each(mappedFields, function(field) {
  requiredModuleForField[field] = _fields._map[field].split('.')[0];
});

// Given a list of fields, return the names of all the modules needed to
// supply them.
function requiredModulesForFields(fields) {
  var modules = [];
  _.each(fields, function(field) {
    var module = requiredModuleForField[field];
    if (modules.indexOf(module) === -1)
      modules.push(module);
  });
  return modules;
}

var shownWarning = false;

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

  if (options.fields) {

    var unavailable = _.difference(options.fields, mappedFields);
    if (unavailable.length)
      throw new Error("[yahoo-finance] snapshot(): The following fields " +
        "are no longer available in Yahoo's new API: " +
        JSON.stringify(unavailable) +
        ".  See if you can find something similar in the new quote() API, " +
        "otherwise unfortunately, you are out of luck.  Yahoo ended support " +
        "for their developer API some time ago and made no guarantees to " +
        "maintain that API.  You may want to also check our mapping function " +
        "at " + FIELDS_MAP_GITHUB_URL);

    if (!shownWarning) {
      console.warn("[yahoo-finance] snapshot() has been deprecated.  The " +
        "Yahoo Finance API has fundamentally changed recently.  We will " +
        "attempt to map the requested fields from the new API according to " +
        FIELDS_MAP_GITHUB_URL +
        ".  Please double check this map and your results to ensure " +
        "consistency.  This warning will only be shown once.");
      shownWarning = true;
    }

  } else {

    if (!options.ignoreAllFieldsWarning) {
      throw new Error("[yahoo-finance] snapshot(): No `fields` property was " +
        "given.  This used to return all fields available, but not all these " +
        "fields are available in Yahoo's new API.  We suggest you update " +
        "your code to use the new quote() API instead.  However, you can " +
        "simply specify the exact fields you need, and they'll be fetched if " +
        "available.  Alternative, pass { ignoreAllFieldsWarning: true } and " +
        "all available fields (from the new API) will be returned.  You can " +
        "see the full list of available mappings at " + FIELDS_MAP_GITHUB_URL);
    } else {
      // fetch all fields if undefined
      options.fields = mappedFields;
    }

  }

  options.modules = requiredModulesForFields(options.fields);
}

function _transformSnapshot(fields, symbols, data) {
  var quoteSummary = data.quoteSummary;
  if (!quoteSummary || quoteSummary.error)
    throw new Error(quoteSummary.error);

  var result = quoteSummary.result;
  if (!_.isArray(result) || result.length > 1)
    throw new Error("quoteSummary format has changed, please report this.");

  result = result[0];

  // for 'n', store 'name' from result.price.name, etc.
  // for arrays like 'c', combine values into an array
  var out = {};
  _.each(fields, function(field) {
    // map { c: 'price.regularMarketChange,price.regularMarketChangePercent' }
    if (_fields._map[field].indexOf(',') > 0) {
      var dest = out[_utils.camelize(_fields[field])] = [];
      _.map(_fields._map[field].split(','), function(map) {
        // 'price.symbol' => ['price','symbol']
        map = map.split('.');
        dest.push(result[map[0]][map[1]]);
        // Assumption: no arrays use date fields (currently true)
      });
    } else {
      // 'price.symbol' => ['price','symbol']
      var map = _fields._map[field].split('.');
      var value = result[map[0]][map[1]];

      if (dateFields[map[0]] && dateFields[map[0]].indexOf(map[1]) !== -1)
        value = new Date(value * 1000);

      out[_utils.camelize(_fields[field])] = value;
    }
  });

  return out;
}

function snapshot(options, optionalHttpRequestOptions, cb) {
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
          .then(function (data) {
            return _transformSnapshot(options.fields, symbols, data);
          })
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
exports.default = snapshot;

// For testing
exports.mappedFields = mappedFields;

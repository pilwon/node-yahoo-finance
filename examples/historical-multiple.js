/*
 * lib/historical-multiple.js
 */

'use strict';

var util = require('util');

require('colors');

var _ = require('lodash'),
    yahooFinance = require('..');

var SYMBOLS = [
  'AAPL',
  'AMZN',
  'GOOGL',
  'YHOO'
];

yahooFinance.historical({
  symbols: SYMBOLS,
  from: '2012-01-01',
  to: '2012-12-31',
  period: 'd' // Optional: d = daily (default), w = weekly, m = monthly, v = dividends only
}, function (err, results) {
  if (err) { throw err; }

  _.each(results, function (result) {
    console.log(util.format(
      '=== %s (%d) ===',
      result.symbol,
      result.quotes.length
    ).cyan);
    console.log(result.url.yellow);
    console.log(
      '%s\n...\n%s',
      JSON.stringify(result.quotes[0], null, 2),
      JSON.stringify(result.quotes[result.quotes.length - 1], null, 2)
    );
  });
});

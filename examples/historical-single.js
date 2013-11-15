/*
 * lib/historical-single.js
 */

'use strict';

var util = require('util');

require('colors');

var _ = require('lodash'),
    yahooFinance = require('..');

var SYMBOL = 'AAPL';

yahooFinance.historical({
  symbol: SYMBOL
}, function (err, quotes, url, symbol) {
  if (err) { throw err; }

  console.log(util.format(
    '=== %s (%d) ===',
    symbol,
    quotes.length
  ).cyan);
  console.log(url.yellow);
  console.log(
    '%s\n...\n%s',
    JSON.stringify(quotes[0], null, 2),
    JSON.stringify(quotes[quotes.length - 1], null, 2)
  );
});

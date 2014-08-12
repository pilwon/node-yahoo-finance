/*
 * lib/historical-single.js
 */

'use strict';

var util = require('util');

require('colors');

var yahooFinance = require('..');

var SYMBOL = 'AAPL';

yahooFinance.historical({
  symbol: SYMBOL,
  from: '2012-01-01',
  to: '2012-12-31',
  period: 'd' // Optional: d = daily (default), w = weekly, m = monthly, v = dividends only
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

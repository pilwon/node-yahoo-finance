var util = require('util');

require('colors');

var yahooFinance = require('../..');

var SYMBOL = 'AAPL';

yahooFinance.historical({
  symbol: SYMBOL,
  from: '2012-01-01',
  to: '2012-12-31',
  period: 'd'
}, function (err, quotes) {
  if (err) { throw err; }
  console.log(util.format(
    '=== %s (%d) ===',
    SYMBOL,
    quotes.length
  ).cyan);
  if (quotes[0]) {
    console.log(
      '%s\n...\n%s',
      JSON.stringify(quotes[0], null, 2),
      JSON.stringify(quotes[quotes.length - 1], null, 2)
    );
  } else {
    console.log('N/A');
  }
});

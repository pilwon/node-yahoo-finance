var util = require('util');

require('colors');

var _ = require('lodash');
var yahooFinance = require('../..');

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
  period: 'd'
}).then(function (result) {
  _.each(result, function (quotes, symbol) {
    console.log(util.format(
      '=== %s (%d) ===',
      symbol,
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
});

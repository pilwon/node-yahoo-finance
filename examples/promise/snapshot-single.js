var util = require('util');

require('colors');

var _ = require('lodash');
var yahooFinance = require('../..');

var SYMBOL = 'AAPL';

yahooFinance.snapshot({
  symbol: SYMBOL,
  fields: ['s', 'l1', 'd1', 't1', 'c1', 'o', 'h', 'g']
}).then(function (snapshot) {
  console.log(util.format('=== %s ===', SYMBOL).cyan);
  console.log(JSON.stringify(snapshot, null, 2));
});

var util = require('util');

require('colors');

var _ = require('lodash');
var yahooFinance = require('../..');

var SYMBOLS = [
  'AAPL',
  'GOOG',
  'MSFT',
  'IBM',
  'AMZN',
  'ORCL',
  'INTC',
  'QCOM',
  'FB',
  'CSCO',
  'SAP',
  'TSM',
  'BIDU',
  'EMC',
  'HPQ',
  'TXN',
  'ERIC',
  'ASML',
  'CAJ',
  'YHOO',
];

yahooFinance.snapshot({
  symbols: SYMBOLS,
  fields: ['s', 'l1', 'd1', 't1', 'c1', 'o', 'h', 'g']
}).then(function (result) {
  _.each(result, function (snapshot, symbol) {
    console.log(util.format('=== %s ===', symbol).cyan);
    console.log(JSON.stringify(snapshot, null, 2));
  });
});

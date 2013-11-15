/*
 * lib/snapshot.js
 */

'use strict';

var util = require('util');

require('colors');

var _ = require('lodash'),
    yahooFinance = require('..');

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
}, function (err, data, url, fields) {
  if (err) { throw err; }

  console.log(util.format('[Fields] %s', fields.join(',')).yellow);
  console.log(url.yellow);

  _.each(data, function (result, symbol) {
    console.log(util.format('=== %s ===', symbol).cyan);
    console.log(JSON.stringify(result, null, 2));
  });
});

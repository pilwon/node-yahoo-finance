# yahoo-finance

`yahoo-finance` is [Yahoo Finance](http://finance.yahoo.com/) historical quotes and snapshot data downloader written in [Node.js](http://nodejs.org/).

The library handles fetching, parsing, and cleaning of CSV data and returns JSON result that is convenient and easy to work with.


## Installation

    $ npm install yahoo-finance


## Usage

```js
var yahooFinance = require('yahoo-finance');

yahooFinance.historical({
  symbol: 'AAPL',
  from: '2012-01-01',
  to: '2012-12-31'
}, function (err, quotes, url, symbol) {
  //...
});

yahooFinance.snapshot({
  symbols: ['AAPL', 'GOOG'],
  fields: ['s', 'n', 'd1', 'l1', 'y', 'r']
}, function (err, data, url, symbol) {
  //...
});
```

* [See more comprehensive examples here.](https://github.com/pilwon/node-yahoo-finance/tree/master/examples)


## API

### Download Historical Data (single symbol)

```js
yahooFinance.historical({
  symbol: SYMBOL,
  from: START_DATE,
  to: END_DATE
}, function (err, quotes, url, symbol) {
  /*
  {
    quotes: [
      {
        date: Thu Nov 07 2013 00:00:00 GMT-0500 (EST),
        open: 45.1,
        high: 50.09,
        low: 44,
        close: 44.9,
        volume: 117701700,
        adjClose: 44.9,
        symbol: 'TWTR'
      },
      ...
      {
        date: Thu Nov 14 2013 00:00:00 GMT-0500 (EST),
        open: 42.34,
        high: 45.67,
        low: 42.24,
        close: 44.69,
        volume: 11090800,
        adjClose: 44.69,
        symbol: 'TWTR'
      }
    ],
    url: 'http://ichart.finance.yahoo.com/table.csv?s=TWTR&a=1&b=1&c=1900&d=11&e=15&f=2013&g=d&ignore=.csv',
    symbol: 'TWTR'
  }
  */
});
```

### Download Historical Data (multiple symbols)

```js
yahooFinance.historical({
  symbols: [
    SYMBOL1,
    SYMBOL2
  ],
  from: START_DATE,
  to: END_DATE
}, function (err, results) {
  /*
  [
    {
      quotes: [
        {
          date: Fri Apr 12 1996 00:00:00 GMT-0400 (EDT),
          open: 25.25,
          high: 43,
          low: 24.5,
          close: 33,
          volume: 408720000,
          adjClose: 1.38,
          symbol: 'YHOO'
        },
        ...
        {
          date: Thu Nov 14 2013 00:00:00 GMT-0500 (EST),
          open: 35.07,
          high: 35.89,
          low: 34.76,
          close: 35.69,
          volume: 21368600,
          adjClose: 35.69,
          symbol: 'YHOO'
        }
      ],
      url: 'http://ichart.finance.yahoo.com/table.csv?s=YHOO&a=1&b=1&c=1900&d=11&e=15&f=2013&g=d&ignore=.csv',
      symbol: 'YHOO'
    },
    {
      quotes: [
        {
          date: Thu Aug 19 2004 00:00:00 GMT-0400 (EDT),
          open: 100,
          high: 104.06,
          low: 95.96,
          close: 100.34,
          volume: 22351900,
          adjClose: 100.34,
          symbol: 'GOOG'
        },
        ...
        {
          date: Thu Nov 14 2013 00:00:00 GMT-0500 (EST),
          open: 1033.92,
          high: 1039.75,
          low: 1030.35,
          close: 1035.23,
          volume: 1166700,
          adjClose: 1035.23,
          symbol: 'GOOG'
        }
      ],
      url: 'http://ichart.finance.yahoo.com/table.csv?s=GOOG&a=1&b=1&c=1900&d=11&e=15&f=2013&g=d&ignore=.csv',
      symbol: 'GOOG'
    },
    ...
  ]
  */
});
```

### Download Snapshot Data

```js
yahooFinance.snapshot({
  symbols: [
    SYMBOL1,
    SYMBOL2
  ],
  fields: FIELDS  // ex: ['s', 'n', 'd1', 'l1', 'y', 'r']
}, function (err, data, url, fields) {
  /*
  {
    data:  {
      AAPL: {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        lastTradeDate: '11/15/2013',
        lastTradePriceOnly: '524.88',
        dividendYield: '2.23',
        peRatio: '13.29'
      },
      GOOG: {
        symbol: 'GOOG',
        name: 'Google Inc.',
        lastTradeDate: '11/15/2013',
        lastTradePriceOnly: '1034.23',
        dividendYield: 'N/A',
        peRatio: '28.17'
      }
    },
    url: 'http://download.finance.yahoo.com/d/quotes.csv?s=AAPL%2CGOOG%2CMSFT%2CIBM%2CAMZN%2CORCL%2CINTC%2CQCOM%2CFB%2CCSCO%2CSAP%2CTSM%2CBIDU%2CEMC%2CHPQ%2CTXN%2CERIC%2CASML%2CCAJ%2CYHOO&f=snd1l1yr',
    fields: [
      's',
      'n',
      'd1',
      'l1',
      'y',
      'r'
    ]
  */
});
```


## Credits

  See the [contributors](https://github.com/pilwon/node-yahoo-finance/graphs/contributors).


## License

<pre>
The MIT License (MIT)

Copyright (c) 2013 Pilwon Huh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
</pre>

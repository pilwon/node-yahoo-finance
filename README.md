# yahoo-finance

`yahoo-finance` is [Yahoo Finance](http://finance.yahoo.com/) client library for [Node.js](http://nodejs.org/).


## Installation

    $ npm install yahoo-finance


## Usage

```js
var yahooFinance = require('yahoo-finance');

yahooFinance.historical({
  symbol: 'AAPL'
}, function (err, quotes, url, symbol) {
  //...
}
```

* [See more comprehensive examples here.](https://github.com/pilwon/node-yahoo-finance/tree/master/examples)


## API

### Download Historical Data (single symbol)

```js
yahooFinance.historical({
  symbol: SYMBOL
}, function (err, quotes, url, symbol) {
  /*
  {
    quotes: [
      {
        Date: Thu Nov 07 2013 00:00:00 GMT-0500 (EST),
        Open: 45.1,
        High: 50.09,
        Low: 44,
        Close: 44.9,
        Volume: 117701700,
        AdjClose: 44.9,
        Symbol: 'TWTR'
      },
      ...
      {
        Date: Thu Nov 14 2013 00:00:00 GMT-0500 (EST),
        Open: 42.34,
        High: 45.67,
        Low: 42.24,
        Close: 44.69,
        Volume: 11090800,
        AdjClose: 44.69,
        Symbol: 'TWTR'
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
  ]
}, function (err, results) {
  /*
  [
    {
      quotes: [
        {
          Date: Fri Apr 12 1996 00:00:00 GMT-0400 (EDT),
          Open: 25.25,
          High: 43,
          Low: 24.5,
          Close: 33,
          Volume: 408720000,
          AdjClose: 1.38,
          Symbol: 'YHOO'
        },
        ...
        {
          Date: Thu Nov 14 2013 00:00:00 GMT-0500 (EST),
          Open: 35.07,
          High: 35.89,
          Low: 34.76,
          Close: 35.69,
          Volume: 21368600,
          AdjClose: 35.69,
          Symbol: 'YHOO'
        }
      ],
      url: 'http://ichart.finance.yahoo.com/table.csv?s=YHOO&a=1&b=1&c=1900&d=11&e=15&f=2013&g=d&ignore=.csv',
      symbol: 'YHOO'
    },
    {
      quotes: [
        {
          Date: Thu Aug 19 2004 00:00:00 GMT-0400 (EDT),
          Open: 100,
          High: 104.06,
          Low: 95.96,
          Close: 100.34,
          Volume: 22351900,
          AdjClose: 100.34,
          Symbol: 'GOOG'
        },
        ...
        {
          Date: Thu Nov 14 2013 00:00:00 GMT-0500 (EST),
          Open: 1033.92,
          High: 1039.75,
          Low: 1030.35,
          Close: 1035.23,
          Volume: 1166700,
          AdjClose: 1035.23,
          Symbol: 'GOOG'
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
  fields: FIELDS  // ex: 'snd1l1yr' or ['s', 'n', 'd1', 'l1', 'y', 'r']
}, function (err, results) {
  /*
  ...
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

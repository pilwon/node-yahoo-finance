## PLEASE READ: This library is partially broken due to sudden API change by Yahoo Finance. The fantastic [@gadicc](https://github.com/gadicc) is currently working on a fix to support the new API. Please follow [PR #42](https://github.com/pilwon/node-yahoo-finance/pull/42) for the progress.

# yahoo-finance

`yahoo-finance` is [Yahoo Finance](http://finance.yahoo.com/) historical quotes and snapshot data downloader written in [Node.js](http://nodejs.org/).

The library handles fetching, parsing, and cleaning of CSV data and returns JSON result that is convenient and easy to work with. Both callback (last parameter) and promises (using [Bluebird](https://github.com/petkaantonov/bluebird)) styles are supported.

Also check out [google-finance](https://github.com/pilwon/node-google-finance).


## Important: New Yahoo API

Yahoo completely replaced their API on 2017-05-16.  This interim release is intended to get you up and running again quickly, but we're still working on it.  Note also that Yahoo stopped supporting their API for developers some time ago, so no guarantees can be made about service availability, but probably this package will keep working thanks to the magic of open-source.  Regarding the package API:

* `historical()` - should work as expected - please check the output and report any inconsistencies.

* `snapshot()` - deprecated - returns the original format for SOME old options via a mapping layer.  Since Yahoo's new API does not contain all the same data as the old version, 100% compatibility is impossible - but for the most common options, this should ease upgrade pains.  When you can, transition to the new `quote()` API instead.

* `quote()` - NEW API more faithful to Yahoo's new API.  See below.  This replaces `snapshot()` and we suggest you use it instead.


## Installation

    $ npm install --save yahoo-finance


## Usage

```js
var yahooFinance = require('yahoo-finance');

yahooFinance.historical({
  symbol: 'AAPL',
  from: '2012-01-01',
  to: '2012-12-31',
  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
}, function (err, quotes) {
  //...
});

// This replaces the deprecated snapshot() API
yahooFinance.quote({
  symbol: 'AAPL',
  modules: [ 'price', 'summaryDetail' ] // see the docs for the full list
}, function (err, quotes) {
  // ...
});

```

* [See more comprehensive examples here.](https://github.com/pilwon/node-yahoo-finance/tree/master/examples)

* See the [full quote() docs](docs/quote.md) for the list of all possible
modules and the data they return.

* See also the [deprecated snapshot() API](docs/snapshot.md) docs, for
reference.

## API

### Download Historical Data (single symbol)

```js
yahooFinance.historical({
  symbol: SYMBOL,
  from: START_DATE,
  to: END_DATE
}, function (err, quotes) {
  /*
  [
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
  ]
  */
});
```

### Download Historical Data (multiple symbols)

```js
yahooFinance.historical({
  symbols: [SYMBOL1, SYMBOL2],
  from: START_DATE,
  to: END_DATE
}, function (err, result) {
  /*
  {
    YHOO: [
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
    GOOGL: [
      {
        date: Thu Aug 19 2004 00:00:00 GMT-0400 (EDT),
        open: 100,
        high: 104.06,
        low: 95.96,
        close: 100.34,
        volume: 22351900,
        adjClose: 100.34,
        symbol: 'GOOGL'
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
        symbol: 'GOOGL'
      }
    ],
    ...
  }
  */
});
```

### Specifying request options

Optionally request options (such as a proxy) can be specified by inserting an
extra parameter just before the callback:


```js
var httpRequestOptions = {
  proxy: 'http://localproxy.com'
};


yahooFinance.historical({
  symbol: SYMBOL,
  from: START_DATE,
  to: END_DATE
}, httpRequestOptions, function (err, quotes) {
  // Result
});


yahooFinance.quote({
  symbol: SYMBOL,
  modules: MODULES  // ex: ['price', 'summaryDetail']
}, httpRequestOptions, function (err, snapshot) {
  // Result
});
```

## Credits

  See the [contributors](https://github.com/pilwon/node-yahoo-finance/graphs/contributors).

* Special thanks to [@gadicc](https://github.com/gadicc) who brought the broken library back to life when Yahoo suddently changed their API. (check out his hero work at PR [#37](https://github.com/pilwon/node-yahoo-finance/pull/37), [#41](https://github.com/pilwon/node-yahoo-finance/pull/41), and [#42](https://github.com/pilwon/node-yahoo-finance/pull/42))


## License

<pre>
The MIT License (MIT)

Copyright (c) 2013-2017 Pilwon Huh

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

[![Analytics](https://ga-beacon.appspot.com/UA-47034562-15/node-yahoo-finance/readme?pixel)](https://github.com/pilwon/node-yahoo-finance)

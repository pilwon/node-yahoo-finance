# yahoo-finance

`yahoo-finance` is [Yahoo Finance](http://finance.yahoo.com/) historical quotes and snapshot data downloader written in [Node.js](http://nodejs.org/).

The library handles fetching, parsing, and cleaning of CSV data and returns JSON result that is convenient and easy to work with. Both callback (last parameter) and promises (using [Bluebird](https://github.com/petkaantonov/bluebird)) styles are supported.

Also check out [google-finance](https://github.com/pilwon/node-google-finance).


## Installation

    $ npm install yahoo-finance


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

yahooFinance.snapshot({
  symbol: 'AAPL',
  fields: ['s', 'n', 'd1', 'l1', 'y', 'r'],
}, function (err, snapshot) {
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

### Download Snapshot Data (single symbol)

```js
yahooFinance.snapshot({
  symbol: SYMBOL,
  fields: FIELDS  // ex: ['s', 'n', 'd1', 'l1', 'y', 'r']
}, function (err, snapshot) {
  /*
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    lastTradeDate: '11/15/2013',
    lastTradePriceOnly: '524.88',
    dividendYield: '2.23',
    peRatio: '13.29'
  }
  */
});
```

### Download Snapshot Data (multiple symbols)

```js
yahooFinance.snapshot({
  symbols: [SYMBOL1, SYMBOL2],
  fields: FIELDS  // ex: ['s', 'n', 'd1', 'l1', 'y', 'r']
}, function (err, snapshot) {
  /*
  {
    AAPL: {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      lastTradeDate: '11/15/2013',
      lastTradePriceOnly: '524.88',
      dividendYield: '2.23',
      peRatio: '13.29'
    },
    GOOGL: {
      symbol: 'GOOGL',
      name: 'Google Inc.',
      lastTradeDate: '11/15/2013',
      lastTradePriceOnly: '1034.23',
      dividendYield: 'N/A',
      peRatio: '28.17'
    }
  }
  */
});
```



### Fields

```
s:	Symbol
```

#### Pricing

```
a:	Ask
b:	Bid
b2:	Ask (Realtime)
b3:	Bid (Realtime)
p:	Previous Close
o:	Open
```

#### Dividends

```
y:	Dividend Yield
d:	Dividend Per Share
r1:	Dividend Pay Date
q:	Ex-Dividend Date
```

#### Date

```
c1:	Change
c:	Change And Percent Change
c6:	Change (Realtime)
k2:	Change Percent (Realtime)
p2:	Change in Percent
d1:	Last Trade Date
d2:	Trade Date
t1:	Last Trade Time
```

#### Averages

```
c8:	After Hours Change (Realtime)
c3:	Commission
g:	Day’s Low
h:	Day’s High
k1:	Last Trade (Realtime) With Time
l:	Last Trade (With Time)
l1:	Last Trade (Price Only)
t8:	1 yr Target Price
m5:	Change From 200-day Moving Average
m6:	Percent Change From 200-day Moving Average
m7:	Change From 50-day Moving Average
m8:	Percent Change From 50-day Moving Average
m3:	50-day Moving Average
m4:	200-day Moving Average
```

#### Misc

```
w1:	Day’s Value Change
w4:	Day’s Value Change (Realtime)
p1:	Price Paid
m:	Day’s Range
m2:	Day’s Range (Realtime)
g1:	Holdings Gain Percent
g3:	Annualized Gain
g4:	Holdings Gain
g5:	Holdings Gain Percent (Realtime)
g6:	Holdings Gain (Realtime)
```

#### 52 Week Pricing

```
k:	52-week High
j:	52-week Low
j5:	Change From 52-week Low
k4:	Change From 52-week High
j6:	Percent Change From 52-week Low
k5:	Percebt Change From 52-week High
w:	52-week Range
```

#### System Info

```
i:	More Info
j1:	Market Capitalization
j3:	Market Cap (Realtime)
f6:	Float Shares
n:	Name
n4:	Notes
s1:	Shares Owned
x:	Stock Exchange
j2:	Shares Outstanding
```

#### Volume

```
v:	Volume
a5:	Ask Size
b6:	Bid Size
k3:	Last Trade Size
a2:	Average Daily Volume
```

#### Ratio

```
e:	Earnings Per Share
e7:	EPS Estimate Current Year
e8:	EPS Estimate Next Year
e9:	EPS Estimate Next Quarter
b4:	Book Value
j4:	EBITDA
p5:	Price per Sales
p6:	Price per Book
r:	PE Ratio
r2:	PE Ratio (Realtime)
r5:	PEG Ratio
r6:	Price Per EPS Estimate Current Year
r7:	Price Per EPS Estimate Next Year
s7:	Short Ratio
```

#### Misc

```
t7:	Ticker Trend
t6:	Trade Links
i5:	Order Book (Realtime)
l2:	High Limit
l3:	Low Limit
v1:	Holdings Value
v7:	Holdings Value (Realtime)
s6:	Revenue
e1: Error Indication (returned for symbol changed or invalid)
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


yahooFinance.snapshot({
  symbol: SYMBOL,
  fields: FIELDS  // ex: ['s', 'n', 'd1', 'l1', 'y', 'r']
}, httpRequestOptions, function (err, snapshot) {
  // Result
});
```

## Credits

  See the [contributors](https://github.com/pilwon/node-yahoo-finance/graphs/contributors).


## License

<pre>
The MIT License (MIT)

Copyright (c) 2013-2016 Pilwon Huh

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

# quote

## Usage:

```js
var yahooFinance = require('yahoo-finance');

yahooFinance.quote({
  symbol: 'TSLA',
  modules: ['price', 'summaryDetail']       // optional; default modules.
}, function(err, quote) {
  console.log(quote);
  {
    price: {
      // output from price module (see below)
    },
    summaryDetail: {
      // output from summaryDetail module (see below)
    }
  }
});
```

Without a callback, `quote()` returns a **promise**.  There is also a
'shortcut' alternative API, as follows (shown using ES7 async-wait syntax).

```js
const result = await quote('TSLA');  // implies default modules below
const result = await quote('TSLA', ['summaryDetail', 'recommendationTrend']);
```

## Modules and sample output

**recommendationTrend**:

```js
{
  "recommendationTrend": {
    "trend": [{
      "period": "0w",
      "strongBuy": 0,
      "buy": 0,
      "hold": 0,
      "sell": 0,
      "strongSell": 0
    }, {
      "period": "-1w",
      "strongBuy": 0,
      "buy": 0,
      "hold": 0,
      "sell": 0,
      "strongSell": 0
    }, {
      "period": "0m",
      "strongBuy": 3,
      "buy": 5,
      "hold": 8,
      "sell": 6,
      "strongSell": 0
    }, {
      "period": "-1m",
      "strongBuy": 3,
      "buy": 3,
      "hold": 8,
      "sell": 5,
      "strongSell": 0
    }, {
      "period": "-2m",
      "strongBuy": 3,
      "buy": 2,
      "hold": 8,
      "sell": 6,
      "strongSell": 0
    }, {
      "period": "-3m",
      "strongBuy": 3,
      "buy": 3,
      "hold": 8,
      "sell": 6,
      "strongSell": 0
    }],
    "maxAge": 86400
  }
}
```

**summaryDetail**

```js
{
  "summaryDetail": {
    "maxAge": 1,
    "priceHint": 2,
    "previousClose": 313.06,
    "open": 315.5,
    "dayLow": 310.2,
    "dayHigh": 316.5,
    "regularMarketPreviousClose": 313.06,
    "regularMarketOpen": 315.5,
    "regularMarketDayLow": 310.2,
    "regularMarketDayHigh": 316.5,
    "dividendRate": 1.56,
    "dividendYield": 0.023,
    "exDividendDate": 2017-02-09T00:00:00.000Z,
    "payoutRatio": 0.66080004,
    "fiveYearAvgDividendYield": 2.59,
    "beta": 1.15078,
    "trailingPE": -65.177185,
    "forwardPE": -330.6702,
    "volume": 4628544,
    "regularMarketVolume": 4628544,
    "averageVolume": 6076252,
    "averageVolume10days": 5380128,
    "averageDailyVolume10Day": 5380128,
    "bid": 310.3,
    "ask": 310.72,
    "bidSize": 400,
    "askSize": 200,
    "marketCap": 51056934912,
    "fiftyTwoWeekLow": 178.19,
    "fiftyTwoWeekHigh": 327.66,
    "priceToSalesTrailing12Months": 5.972023,
    "fiftyDayAverage": 309.1597,
    "twoHundredDayAverage": 249.92029,
    "trailingAnnualDividendRate": 1.53,
    "trailingAnnualDividendYield": 0.022603042
  }
}
```

**earnings**

```js
{
  "earnings": {
    "maxAge": 86400,
    "earningsChart": {
      "quarterly": [{
        "date": "2Q2016",
        "actual": -1.61,
        "estimate": -0.51
      }, {
        "date": "3Q2016",
        "actual": 0.71,
        "estimate": -0.54
      }, {
        "date": "4Q2016",
        "actual": -0.69,
        "estimate": -0.43
      }, {
        "date": "1Q2017",
        "actual": -1.33,
        "estimate": -0.81
      }],
      "currentQuarterEstimate": -1.64,
      "currentQuarterEstimateDate": "2Q",
      "currentQuarterEstimateYear": 2017
    },
    "financialsChart": {
      "yearly": [{
        "date": 2014,
        "revenue": 3198356000,
        "earnings": -294040000
      }, {
        "date": 2015,
        "revenue": 4046025000,
        "earnings": -888663000
      }, {
        "date": 2016,
        "revenue": 7000132000,
        "earnings": -674914000
      }],
      "quarterly": [{
        "date": "2Q2016",
        "revenue": 1270017000,
        "earnings": -293188000
      }, {
        "date": "3Q2016",
        "revenue": 2298436000,
        "earnings": 21878000
      }, {
        "date": "4Q2016",
        "revenue": 2284631000,
        "earnings": -121337000
      }, {
        "date": "1Q2017",
        "revenue": 2696270000,
        "earnings": -330277000
      }]
    }
  }
}
```

**calendarEvents**

```js
{
  "calendarEvents": {
    "maxAge": 1,
    "earnings": {
      "earningsDate": [1501545600, 1502064000],
      "earningsAverage": -1.64,
      "earningsLow": -2.98,
      "earningsHigh": -0.5,
      "revenueAverage": 2636630000,
      "revenueLow": 2457200000,
      "revenueHigh": 2887970000
    },
    "exDividendDate": 2017-02-09T00:00:00.000Z,
    "dividendDate": 2017-05-18T00:00:00.000Z
  }
}
```

**upgradeDowngradeHistory**

```js
{
  "upgradeDowngradeHistory": {
    "history": [{
      "epochGradeDate": 2017-01-24T00:00:00.000Z,
      "firm": "Piper Jaffray",
      "toGrade": "Overweight",
      "fromGrade": "Neutral",
      "action": "up"
    }, {
      "epochGradeDate": 2016-10-27T00:00:00.000Z,
      "firm": "Bernstein",
      "toGrade": "Mkt Perform",
      "fromGrade": "",
      "action": "init"
    },
    // ...
    {
      "epochGradeDate": 2007-01-18T00:00:00.000Z,
      "firm": "Dougherty & Company",
      "toGrade": "Buy",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 2007-01-18T00:00:00.000Z,
      "firm": "Deutsche Bank",
      "toGrade": "Hold",
      "fromGrade": "",
      "action": "init"
    }],
    "maxAge": 86400
  }
}
```

**price**

```js
{
  "price": {
    "maxAge": 1,
    "preMarketChangePercent": 7.3050486E-4,
    "preMarketChange": 0.05000305,
    "preMarketTime": 2017-05-24T13:29:46.000Z,
    "preMarketPrice": 68.5,
    "preMarketSource": "FREE_REALTIME",
    "postMarketChangePercent": -0.0014798812,
    "postMarketChange": -0.45999146,
    "postMarketTime": 2017-05-23T23:59:01.000Z,
    "postMarketPrice": 310.37,
    "postMarketSource": "FREE_REALTIME",
    "regularMarketChangePercent": -0.0071232705,
    "regularMarketChange": -2.230011,
    "regularMarketTime": 2017-05-24T15:20:15.000Z,
    "priceHint": 2,
    "regularMarketPrice": 310.83,
    "regularMarketDayHigh": 316.5,
    "regularMarketDayLow": 310.2,
    "regularMarketVolume": 4628544,
    "averageDailyVolume10Day": 5380128,
    "averageDailyVolume3Month": 6076252,
    "regularMarketPreviousClose": 313.06,
    "regularMarketSource": "FREE_REALTIME",
    "regularMarketOpen": 315.5,
    "exchange": "NMS",
    "exchangeName": "NasdaqGS",
    "marketState": "CLOSED",
    "quoteType": "EQUITY",
    "symbol": "TSLA",
    "underlyingSymbol": null,
    "shortName": "Tesla, Inc.",
    "longName": "Tesla, Inc.",
    "currency": "USD",
    "quoteSourceName": "Nasdaq Real Time Price",
    "currencySymbol": "$"
  }
}
```

**defaultKeyStatistics**

```js
{
  "defaultKeyStatistics": {
    "maxAge": 1,
    "forwardPE": -357.27585,
    "profitMargins": -0.08456001,
    "floatShares": 121545634,
    "sharesOutstanding": 164260000,
    "sharesShort": 31068700,
    "sharesShortPriorMonth": 31013300,
    "heldPercentInsiders": 0.22283001,
    "heldPercentInstitutions": 0.62,
    "shortRatio": 5.27,
    "shortPercentOfFloat": 0.383402,
    "beta": 1.15078,
    "category": null,
    "bookValue": 30.764,
    "priceToBook": 10.103692,
    "fundFamily": null,
    "legalType": null,
    "lastFiscalYearEnd": 2016-09-24T00:00:00.000Z,
    "nextFiscalYearEnd": 2018-09-24T00:00:00.000Z,
    "mostRecentQuarter": 2017-04-01T00:00:00.000Z,
    "netIncomeToCommon": -722924032,
    "trailingEps": -4.769,
    "forwardEps": -0.94,
    "pegRatio": -1.59,
    "lastSplitFactor": "2/1",
    "lastSplitDate": 2014-06-09T00:00:00.000Z,
    "52WeekChange": 0.44787717,
    "SandP52WeekChange": 0.15511417
  }
}
```

**summaryProfile**

```js
{
  "summaryProfile": {
    "address1": "3500 Deer Creek Road",
    "city": "Palo Alto",
    "state": "CA",
    "zip": "94304",
    "country": "United States",
    "phone": "650-681-5000",
    "website": "http://www.tesla.com",
    "industry": "Auto Manufacturers - Major",
    "sector": "Consumer Goods",
    "longBusinessSummary": "Tesla, Inc. designs, develops, manufactures, and sells electric vehicles and energy storage products in the United States, China, Norway, and internationally. The company operates in two segments, Automotive, and Energy Generation and Storage. It primarily offers sedans and sport utility vehicles. The company also provides electric vehicle powertrain components and systems to other manufacturers; and services for electric vehicles through its 135 company-owned service centers and Service Plus locations, as well as through Tesla Ranger mobile technicians. It sells its products through a network of company-owned stores and galleries, as well as through Internet. In addition, the company offers energy storage products, such as rechargeable lithium-ion battery systems for use in homes, commercial facilities, and utility sites. Further, the company designs, manufactures, installs, maintains, leases, and sells solar energy systems to residential and commercial customers through a sales organization that include specialized internal call centers, outside sales force, a channel partner network, and a customer referral program, as well as through selected Tesla stores. Additionally, it sells renewable electricity generated by solar energy systems to customers. The company was formerly known as Tesla Motors, Inc. and changed its name to Tesla, Inc. in February 2017. Tesla, Inc. was founded in 2003 and is headquartered in Palo Alto, California.",
    "fullTimeEmployees": 17782,
    "companyOfficers": [],
    "maxAge": 86400
  }
}
```

**financialData**

```js
{
  "financialData": {
    "maxAge": 86400,
    "currentPrice": 310.83,
    "targetHighPrice": 380.0,
    "targetLowPrice": 155.0,
    "targetMeanPrice": 275.2,
    "targetMedianPrice": 305.0,
    "recommendationMean": 2.9,
    "recommendationKey": "hold",
    "numberOfAnalystOpinions": 15,
    "totalCash": 4006593024,
    "totalCashPerShare": 24.392,
    "ebitda": 530736032,
    "totalDebt": 9667725312,
    "quickRatio": 0.711,
    "currentRatio": 1.124,
    "totalRevenue": 8549353472,
    "debtToEquity": 156.916,
    "revenuePerShare": 56.403,
    "returnOnAssets": -0.02317,
    "returnOnEquity": -0.24903,
    "grossProfits": 1599257000,
    "freeCashflow": 673406976,
    "operatingCashflow": 55965000,
    "revenueGrowth": 1.351,
    "grossMargins": 0.23566,
    "ebitdaMargins": 0.062080003,
    "operatingMargins": -0.074250005,
    "profitMargins": -0.08456001
  }
}
```

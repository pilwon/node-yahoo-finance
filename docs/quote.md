# quote

## Usage:

```js
import quote from 'yahoo-finance/lib/quote';

// style 1 (parameters) - returns a promise
const result = await quote('TSLA');  // implies default modules below
const result = await quote('TSLA', ['summaryDetail', 'recommendationTrend']);

// style 2 (similar API to historical() and snapshot()) - returns a promise
const result = await quote({
  symbol: 'TSLA',
  modules: ['price', 'summaryDetail']       // optional; default modules.
});

// Add a callback function as a final argument (with either style) to run
// your callback with the result, rather than returning a promise.
quote('TSLA', function(err, quote) {
  console.log(quote);
});

result;
{
  price: {
    // output from price module (see below)
  },
  summaryDetail: {
    // output from summaryDetail module (see below)
  }
}
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
    "exDividendDate": 1494892800,
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
    "exDividendDate": 1494892800,
    "dividendDate": 1496880000
  }
}
```

**upgradeDowngradeHistory**

```js
{
  "upgradeDowngradeHistory": {
    "history": [{
      "epochGradeDate": 1491782400,
      "firm": "Piper Jaffray",
      "toGrade": "Overweight",
      "fromGrade": "Neutral",
      "action": "up"
    }, {
      "epochGradeDate": 1489017600,
      "firm": "Bernstein",
      "toGrade": "Mkt Perform",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 1488153600,
      "firm": "Goldman",
      "toGrade": "Sell",
      "fromGrade": "Neutral",
      "action": "down"
    }, {
      "epochGradeDate": 1484784000,
      "firm": "Morgan Stanley",
      "toGrade": "Overweight",
      "fromGrade": "Equal-Weight",
      "action": "up"
    }, {
      "epochGradeDate": 1483488000,
      "firm": "Guggenheim",
      "toGrade": "Buy",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 1475712000,
      "firm": "Goldman",
      "toGrade": "Neutral",
      "fromGrade": "Buy",
      "action": "down"
    }, {
      "epochGradeDate": 1467072000,
      "firm": "Argus",
      "toGrade": "Hold",
      "fromGrade": "Buy",
      "action": "down"
    }, {
      "epochGradeDate": 1466726400,
      "firm": "Standpoint Research",
      "toGrade": "Hold",
      "fromGrade": "Sell",
      "action": "up"
    }, {
      "epochGradeDate": 1466640000,
      "firm": "Morgan Stanley",
      "toGrade": "Equal-Weight",
      "fromGrade": "Overweight",
      "action": "down"
    }, {
      "epochGradeDate": 1466553600,
      "firm": "Oppenheimer",
      "toGrade": "Perform",
      "fromGrade": "Outperform",
      "action": "down"
    }, {
      "epochGradeDate": 1465516800,
      "firm": "Piper Jaffray",
      "toGrade": "Neutral",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 1464912000,
      "firm": "Sterne Agee CRT",
      "toGrade": "Buy",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 1463529600,
      "firm": "Goldman",
      "toGrade": "Buy",
      "fromGrade": "Neutral",
      "action": "up"
    }, {
      "epochGradeDate": 1459987200,
      "firm": "Standpoint Research",
      "toGrade": "Sell",
      "fromGrade": "Hold",
      "action": "down"
    }, {
      "epochGradeDate": 1458518400,
      "firm": "Argus",
      "toGrade": "Buy",
      "fromGrade": "Hold",
      "action": "up"
    }, {
      "epochGradeDate": 1457913600,
      "firm": "Robert W. Baird",
      "toGrade": "Outperform",
      "fromGrade": "Neutral",
      "action": "up"
    }, {
      "epochGradeDate": 1444176000,
      "firm": "Robert W. Baird",
      "toGrade": "Neutral",
      "fromGrade": "Outperform",
      "action": "down"
    }, {
      "epochGradeDate": 1444176000,
      "firm": "RBC Capital Mkts",
      "toGrade": "Sector Perform",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 1441756800,
      "firm": "Oppenheimer",
      "toGrade": "Outperform",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 1437436800,
      "firm": "UBS",
      "toGrade": "Sell",
      "fromGrade": "Neutral",
      "action": "down"
    }, {
      "epochGradeDate": 1430784000,
      "firm": "Jefferies",
      "toGrade": "Buy",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 1427414400,
      "firm": "Argus",
      "toGrade": "Hold",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 1413504000,
      "firm": "MLV & Co",
      "toGrade": "Buy",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 1412726400,
      "firm": "Tigress Financial",
      "toGrade": "Neutral",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 1409616000,
      "firm": "Stifel",
      "toGrade": "Buy",
      "fromGrade": "Hold",
      "action": "up"
    }, {
      "epochGradeDate": 1407715200,
      "firm": "Deutsche Bank",
      "toGrade": "Buy",
      "fromGrade": "Hold",
      "action": "up"
    }, {
      "epochGradeDate": 1395792000,
      "firm": "UBS",
      "toGrade": "Neutral",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 1392854400,
      "firm": "Deutsche Bank",
      "toGrade": "Hold",
      "fromGrade": "Buy",
      "action": "down"
    }, {
      "epochGradeDate": 1392768000,
      "firm": "FBR Capital",
      "toGrade": "Mkt Perform",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 1383782400,
      "firm": "Standpoint Research",
      "toGrade": "Hold",
      "fromGrade": "Sell",
      "action": "up"
    }, {
      "epochGradeDate": 1380672000,
      "firm": "Robert W. Baird",
      "toGrade": "Neutral",
      "fromGrade": "Outperform",
      "action": "down"
    }, {
      "epochGradeDate": 1377129600,
      "firm": "Stifel",
      "toGrade": "Hold",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 1375920000,
      "firm": "Barclays",
      "toGrade": "Equal Weight",
      "fromGrade": "Overweight",
      "action": "down"
    }, {
      "epochGradeDate": 1374796800,
      "firm": "Deutsche Bank",
      "toGrade": "Buy",
      "fromGrade": "Hold",
      "action": "up"
    }, {
      "epochGradeDate": 1362096000,
      "firm": "Northland Capital",
      "toGrade": "Outperform",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 1342569600,
      "firm": "Wunderlich",
      "toGrade": "Sell",
      "fromGrade": "Buy",
      "action": "down"
    }, {
      "epochGradeDate": 1337644800,
      "firm": "Maxim Group",
      "toGrade": "Buy",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 1332720000,
      "firm": "Wunderlich",
      "toGrade": "Buy",
      "fromGrade": "Hold",
      "action": "up"
    }, {
      "epochGradeDate": 1326758400,
      "firm": "Wunderlich",
      "toGrade": "Buy",
      "fromGrade": "Hold",
      "action": "up"
    }, {
      "epochGradeDate": 1321920000,
      "firm": "Wunderlich",
      "toGrade": "Hold",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 1320969600,
      "firm": "Barclays Capital",
      "toGrade": "Overweight",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 1284595200,
      "firm": "Dougherty & Company",
      "toGrade": "Buy",
      "fromGrade": "",
      "action": "init"
    }, {
      "epochGradeDate": 1281312000,
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
    "preMarketTime": 1495533970,
    "preMarketPrice": 68.5,
    "preMarketSource": "FREE_REALTIME",
    "postMarketChangePercent": -0.0014798812,
    "postMarketChange": -0.45999146,
    "postMarketTime": 1495238377,
    "postMarketPrice": 310.37,
    "postMarketSource": "FREE_REALTIME",
    "regularMarketChangePercent": -0.0071232705,
    "regularMarketChange": -2.230011,
    "regularMarketTime": 1495224000,
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

**defaultKeyStatics**

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
    "lastFiscalYearEnd": 1483142400,
    "nextFiscalYearEnd": 1546214400,
    "mostRecentQuarter": 1490918400,
    "netIncomeToCommon": -722924032,
    "trailingEps": -4.769,
    "forwardEps": -0.94,
    "pegRatio": -1.59,
    "lastSplitFactor": "2/1",
    "lastSplitDate": 1045526400,
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
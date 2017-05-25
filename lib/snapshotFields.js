module.exports = {
  s: 'Symbol',

  // Pricing
  a: 'Ask',
  b: 'Bid',
  b2: 'Ask (Realtime)',
  b3: 'Bid (Realtime)',
  p: 'Previous Close',
  o: 'Open',

  // Dividends
  y: 'Dividend Yield',
  d: 'Dividend Per Share',
  r1: 'Dividend Pay Date',
  q: 'Ex-Dividend Date',

  // Date
  c1: 'Change',
  c: 'Change And Percent Change',
  c6: 'Change (Realtime)',
  k2: 'Change Percent (Realtime)',
  p2: 'Change in Percent',
  d1: 'Last Trade Date',
  d2: 'Trade Date',
  t1: 'Last Trade Time',

  // Averages
  c8: 'After Hours Change (Realtime)',
  c3: 'Commission',
  g: 'Day’s Low',
  h: 'Day’s High',
  k1: 'Last Trade (Realtime) With Time',
  l: 'Last Trade (With Time)',
  l1: 'Last Trade (Price Only)',
  t8: '1 yr Target Price',
  m5: 'Change From 200-day Moving Average',
  m6: 'Percent Change From 200-day Moving Average',
  m7: 'Change From 50-day Moving Average',
  m8: 'Percent Change From 50-day Moving Average',
  m3: '50-day Moving Average',
  m4: '200-day Moving Average',

  // Misc
  w1: 'Day’s Value Change',
  w4: 'Day’s Value Change (Realtime)',
  p1: 'Price Paid',
  m: 'Day’s Range',
  m2: 'Day’s Range (Realtime)',
  g1: 'Holdings Gain Percent',
  g3: 'Annualized Gain',
  g4: 'Holdings Gain',
  g5: 'Holdings Gain Percent (Realtime)',
  g6: 'Holdings Gain (Realtime)',

  // 52 Week Pricing
  k: '52-week High',
  j: '52-week Low',
  j5: 'Change From 52-week Low',
  k4: 'Change From 52-week High',
  j6: 'Percent Change From 52-week Low',
  k5: 'Percebt Change From 52-week High',
  w: '52-week Range',

  // System Info
  i: 'More Info',
  j1: 'Market Capitalization',
  j3: 'Market Cap (Realtime)',
  f6: 'Float Shares',
  n: 'Name',
  n4: 'Notes',
  s1: 'Shares Owned',
  x: 'Stock Exchange',
  j2: 'Shares Outstanding',

  // Volume
  v: 'Volume',
  a5: 'Ask Size',
  b6: 'Bid Size',
  k3: 'Last Trade Size',
  a2: 'Average Daily Volume',

  // Ratio
  e: 'Earnings Per Share',
  e7: 'EPS Estimate Current Year',
  e8: 'EPS Estimate Next Year',
  e9: 'EPS Estimate Next Quarter',
  b4: 'Book Value',
  j4: 'EBITDA',
  p5: 'Price per Sales',
  p6: 'Price per Book',
  r: 'PE Ratio',
  r2: 'PE Ratio (Realtime)',
  r5: 'PEG Ratio',
  r6: 'Price Per EPS Estimate Current Year',
  r7: 'Price Per EPS Estimate Next Year',
  s7: 'Short Ratio',

  // Misc
  t7: 'Ticker Trend',
  t6: 'Trade Links',
  i5: 'Order Book (Realtime)',
  l2: 'High Limit',
  l3: 'Low Limit',
  v1: 'Holdings Value',
  v7: 'Holdings Value (Realtime)',
  s6: 'Revenue',
  e1: 'Error Indication (returned for symbol changed or invalid)',

  // Map to v10 API
  _map: {
    s: 'price.symbol',                  // 'Symbol'

    // Pricing
    a: 'summaryDetail.ask',             // 'Ask'
    b: 'summaryDetail.bid',             // 'Bid'
    b2: 'summaryDetail.ask',            // 'Ask (Realtime)'
    b3: 'summaryDetail.bid',            // 'Bid (Realtime)'
    p: 'summaryDetail.previousClose',   // 'Previous Close'
    o: 'summaryDetail.open',            // 'Open'

    // Dividends
    y: 'summaryDetail.dividendYield',   // 'Dividend Yield'
    d: null,                            // 'Dividend Per Share'
    r1: null,                           // 'Dividend Pay Date'
    q: 'summaryDetail.exDividendDate',  // 'Ex-Dividend Date'

    // Date
    c1: 'price.regularMarketChange',    // 'Change'
    c: 'price.regularMarketChange,price.regularMarketChangePercent',  // 'Change And Percent Change'
    c6: 'price.postMarketChange',       // 'Change (Realtime)',
    k2: 'price.postMarketChange',       // 'Change Percent (Realtime)',
    p2: 'price.regularMarketChangePercent',  // 'Change in Percent',
    d1: null,                           // 'Last Trade Date'
    d2: null,                           // 'Trade Date'
    t1: null,                           // 'Last Trade Time'

    // Averages
    c8: null,                           // 'After Hours Change (Realtime)',
    c3: null,                           // 'Commission',
    g: 'summaryDetail.dayLow',          // 'Day’s Low',
    h: 'summaryDetail.dayHigh',         // 'Day’s High',
    k1: null,                           // 'Last Trade (Realtime) With Time',
    l: null,                            // 'Last Trade (With Time)',
    l1: null,                           // 'Last Trade (Price Only)',
    t8: null,                           // '1 yr Target Price',
    m5: null,                           // 'Change From 200-day Moving Average',
    m6: null,                           // 'Percent Change From 200-day Moving Average',
    m7: null,                           // 'Change From 50-day Moving Average',
    m8: null,                           // 'Percent Change From 50-day Moving Average',
    m3: 'summaryDetail.fiftyDayAverage',      // '50-day Moving Average'
    m4: 'summaryDetail.twoHundredDayAverage', // '200-day Moving Average'

    // Misc
    w1: null,                           // 'Day’s Value Change',
    w4: null,                           // 'Day’s Value Change (Realtime)',
    p1: null,                           // 'Price Paid',
    m: null,                            // 'Day’s Range',
    m2: null,                           // 'Day’s Range (Realtime)',
    g1: null,                           // 'Holdings Gain Percent',
    g3: null,                           // 'Annualized Gain',
    g4: null,                           // 'Holdings Gain',
    g5: null,                           // 'Holdings Gain Percent (Realtime)',
    g6: null,                           // 'Holdings Gain (Realtime)',

    // 52 Week Pricing
    k: 'summaryDetail.fiftyTwoWeekHigh',  // '52-week High',
    j: 'summaryDetail.fiftyTwoWeekLow',   // '52-week Low',
    j5: null,                             // 'Change From 52-week Low',
    k4: null,                             // 'Change From 52-week High',
    j6: null,                             // 'Percent Change From 52-week Low',
    k5: null,                             // 'Percebt Change From 52-week High',
    w: null,                              // '52-week Range',

    // System Info
    i: null,                            // 'More Info',
    j1: null,                           // 'Market Capitalization',
    j3: null,                           // 'Market Cap (Realtime)',
    f6: null,                           // 'Float Shares',
    n: 'price.longName',                // 'Name',
    n4: null,                           // 'Notes',
    s1: null,                           // 'Shares Owned',
    x: 'price.exchange',                // 'Stock Exchange',
    j2: null,                           // 'Shares Outstanding',

    // Volume
    v: 'summaryDetail.volume',                    // 'Volume',
    a5: 'summaryDetail.askSize',                  // 'Ask Size',
    b6: 'summaryDetail.bidSize',                  // 'Bid Size',
    k3: null,                                     // 'Last Trade Size',
    a2: 'summaryDetail.averageDailyVolume10Day',  // 'Average Daily Volume',

    // Ratio
    e: 'defaultKeyStatistics.forwardEps',   // 'Earnings Per Share',
    e7: null,                               // 'EPS Estimate Current Year',
    e8: null,                               // 'EPS Estimate Next Year',
    e9: null,                               // 'EPS Estimate Next Quarter',
    b4: 'defaultKeyStatistics.bookValue',   // 'Book Value',
    j4: 'financialData.ebitda',             // 'EBITDA',
    p5: null,                               // 'Price per Sales',
    p6: null,                               // 'Price per Book',
    r: 'summaryDetail.trailingPE',          // 'PE Ratio',
    r2: 'summaryDetail.forwardPE',          // 'PE Ratio (Realtime)',
    r5: 'defaultKeyStatistics.pegRatio',    // 'PEG Ratio',
    r6: null,                               // 'Price Per EPS Estimate Current Year',
    r7: null,                               // 'Price Per EPS Estimate Next Year',
    s7: 'defaultKeyStatistics.shortRatio',  // 'Short Ratio',

    // Misc
    t7: null,                           // 'Ticker Trend',
    t6: null,                           // 'Trade Links',
    i5: null,                           // 'Order Book (Realtime)',
    l2: null,                           // 'High Limit',
    l3: null,                           // 'Low Limit',
    v1: null,                           // 'Holdings Value',
    v7: null,                           // 'Holdings Value (Realtime)',
    s6: null,                           // 'Revenue',
    e1: null,                           // 'Error Indication (returned for symbol changed or invalid)'

  }
};

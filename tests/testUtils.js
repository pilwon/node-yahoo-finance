import fs from 'fs';
import path from 'path';

const fixturePath = (...args) => path.join('tests', 'fixtures', ...args);

const fixtures = {
  historyHtml: fixturePath('history.html'),     // crumb: STATIC_CRUMB
  historyHtml2: fixturePath('history2.html'),   // crumb: sxCZygzUaUK
  historyCsv: fixturePath('history_download_TSLA.csv'),
  quoteJson: fixturePath('quote.json'),
};

const STATIC_CRUMB = 'zhqGa4p9aDu';

// Since the same files are used by multiple tests, but we won't already run
// all tests, this helper ensures we only load (and cache) what we need.
const fileCache = {};
function getFile(name) {
  if (fileCache[name])
    return fileCache[name];

  if (!fixtures[name])
    throw new Error('No fixture file: ' + name);

  fileCache[name] = fs.readFileSync(fixtures[name]).toString();

  // Since we download with httpRequestOptions = { json: true };
  if (name.endsWith('Json'))
    fileCache[name] = JSON.parse(fileCache[name]);

  return fileCache[name];
}

function assertValidHistoricalResult(result) {
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

  result.should.be.an('array');
  result.should.have.length.above(0);

  const row = result[0];
  row.should.include.keys('date', 'open', 'high', 'low', 'close',
    'volume', 'adjClose', 'symbol');
  row.should.be.an('object');
  row.date.should.be.an.instanceOf(Date);
  row.open.should.be.a('number');
  row.high.should.be.a('number');
  row.low.should.be.a('number');
  row.close.should.be.a('number');
  row.volume.should.be.a('number');
  row.adjClose.should.be.a('number');
  row.symbol.should.be.a('string');
}

function assertValidSnapshotResult(result) {
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
  result.should.be.an('object');
  result.should.include.keys('symbol', 'name');
}

export { assertValidHistoricalResult, assertValidSnapshotResult,
  getFile, STATIC_CRUMB };

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import proxyquire from 'proxyquire';

import { parseAndGetCrumb } from './yahooCrumb';
import { stubbedFor } from '../tests/testUtils';

const should = chai.should();
chai.use(chaiAsPromised);

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

describe('historical', () => {

  it('correctly transforms current Yahoo response (2017-05-21)', async () => {

    const historical = proxyquire('./historical', stubbedFor('historyCsv'));
    const result = await historical({
      // Note, these aren't actually used in this test - data from a fixture
      symbol: 'AAPL',
      from: '2012-01-01'
    });

    assertValidHistoricalResult(result);

  });

});

export { assertValidHistoricalResult };

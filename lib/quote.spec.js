import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import proxyquire from 'proxyquire';

import { parseAndGetCrumb } from './yahooCrumb';
import { stubbedFor } from '../tests/testUtils';

const should = chai.should();
chai.use(chaiAsPromised);

describe('quote', () => {

  it('correctly transforms current Yahoo response (2017-05-21)', async () => {

    const fetchQuote = proxyquire('./quote', stubbedFor('quoteJson')).default;
    const result = await fetchQuote({
      // Note, these aren't actually used in this test - data from a fixture
      symbol: 'MSFT'
    });

    result.price.symbol.should.equal('MSFT');

    // check dates
    result.summaryDetail.exDividendDate.should.be.a('date');
    result.calendarEvents.exDividendDate.should.be.a('date');
    result.calendarEvents.dividendDate.should.be.a('date');
    result.upgradeDowngradeHistory.history[0].epochGradeDate.should.be.a('date');
    result.upgradeDowngradeHistory.history[1].epochGradeDate.should.be.a('date');
    result.price.preMarketTime.should.be.a('date');
    result.price.postMarketTime.should.be.a('date');
    result.price.regularMarketTime.should.be.a('date');
    result.defaultKeyStatistics.lastFiscalYearEnd.should.be.a('date');
    result.defaultKeyStatistics.nextFiscalYearEnd.should.be.a('date');
    result.defaultKeyStatistics.mostRecentQuarter.should.be.a('date');
    result.defaultKeyStatistics.lastSplitDate.should.be.a('date');
  });

});

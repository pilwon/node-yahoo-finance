import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import proxyquire from 'proxyquire';

// for nodeify to work with stubbed out functions
import BluebirdPromise from 'bluebird';

import { parseAndGetCrumb } from './yahooCrumb';
import { getFile, stubbedFor } from '../tests/testUtils';

import quote, { _sanitizeQuoteOptions } from './quote';

const should = chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('quote', () => {

  describe('_sanitizeQuoteOptions()', () => {

    it('throws on invalid modules', () => {
      (function() {
        _sanitizeQuoteOptions({ symbol: 'MSFT', modules: ['price', 'invalid'] });
      }).should // Shows invalid modules and suggests other unused ones
        .throw(/(?:do not exist.*"invalid".*Did you mean)(?!"price")/);
    });

  });

  describe('quote()', () => {

    it('calls _sanitizeQuoteOptions()', () => {
      // no need for await here since options are sanitized before promise made
      (function() {
        quote({ symbol: 'MSFT', modules: ['price', 'invalid'] });
      }).should.throw();
    });

    it('correctly transforms current Yahoo response (2017-05-21)', async () => {
      const quote = proxyquire('./quote', stubbedFor('quoteJson')).default;
      const result = await quote({
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

    it('accepts multiple symbols', async () => {
      const download = sinon.stub()
        .usingPromise(BluebirdPromise)
        .resolves(getFile('quoteJson'));

      const quote = proxyquire('./quote', {
        './yahooCrumb': { async getCrumb() { return 'crumb'; } },
        './utils': { download }
      }).default;

      const result = await quote({
        symbols: [ 'TSLA', 'MSFT' ]
      });

      download.should.have.been.calledTwice;
      download.should.have.been.calledWithMatch(/TSLA$/);
      download.should.have.been.calledWithMatch(/MSFT$/);

      result.should.be.an('object');
      result.should.include.keys('TSLA', 'MSFT');
      result.TSLA.price.symbol.should.be.a('string');
      result.MSFT.price.symbol.should.be.a('string');
    });

  });

});

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import proxyquire from 'proxyquire';

import { parseAndGetCrumb } from './yahooCrumb';
import { getFile, stubbedFor } from '../tests/testUtils';

import snapshot, { mappedFields } from './snapshot';

// for nodeify to work with stubbed out functions
import BluebirdPromise from 'bluebird';

const should = chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

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
  result.symbol.should.be.a('string');
}

describe('snapshot', () => {

  it('throws on requesting a no-longer available field', () => {
    (function() {
      snapshot({
        symbol: 'TSLA',
        fields: [ 'y' /* available */, 'd' /* unavailable */ ]
      });
    }).should.throw(/no longer available.*"d"/);
  });

  it('throws when no fields given without ignoreAllFieldsWarning', () => {
    (function() {
      snapshot({
        symbol: 'TSLA',
      });
    }).should.throw(/No `fields` property was given/);
  });

  it('requests correct modules for fields (sample)', async () => {
    let lastSetOpts;
    const stubbedSnapshot = proxyquire('./snapshot', {
      './yahooCrumb': {
        async getCrumb() { return 'crumb'; }
      },
      './utils': {
        download: (url, opts) => {
          lastSetOpts = opts;
          return BluebirdPromise.resolve(getFile('quoteJson'))
        }
      }
    }).default;

    const samplesToTest = [
      { fields: ['s'], modules: ['price'] },
      { fields: ['a'], modules: ['summaryDetail'] },
      { fields: ['a', 's'], modules: ['price','summaryDetail'] },
    ];

    for (let i=0; i < samplesToTest.length; i++) {
      const { fields, modules } = samplesToTest[i];
      await stubbedSnapshot({ symbol: 'TSLA', fields });
      lastSetOpts.modules.split(',').should.be.an('array');
      lastSetOpts.modules.split(',').should.have.members(modules);
    }
  });

  const fullRes = getFile('quoteJson').quoteSummary.result[0];
  const stubbedSnapshot = proxyquire('./snapshot', stubbedFor('quoteJson')).default;

  it('maps fields', async () => {
    const result = await stubbedSnapshot({
      symbol: 'TSLA',                   // Not used, data from fixture
      fields: mappedFields              // Check all mapped fields
    });

    assertValidSnapshotResult(result);
    result.should.be.an('object');

    // Easy check for mismatched mappings
    Object.keys(result).forEach(key => should.exist(result[key], key));

    // Questionably whether it's worth checking like this, but...
    result.symbol.should.equal(fullRes.price.symbol);
    result.name.should.equal(fullRes.price.longName);
    result.dividendYield.should.equal(fullRes.summaryDetail.dividendYield);
    result.peRatio.should.equal(fullRes.summaryDetail.trailingPE);
  });

  it('transforms array fields like c (change, percent)', async () => {
    const result = await stubbedSnapshot({
      symbol: 'TSLA',                   // Not used, data from fixture
      fields: [ 'c' ]                   // Array fields
    });

    result.should.be.an('object');
    result.changeAndPercentChange.should.be.an('array');
    result.changeAndPercentChange[0].should.equal(fullRes.price.regularMarketChange);
    result.changeAndPercentChange[1].should.equal(fullRes.price.regularMarketChangePercent);
  });

  it('transforms dates', async () => {
    const result = await stubbedSnapshot({
      symbol: 'TSLA',                   // Not used, data from fixture
      fields: [ 'q' ]                   // Fields with dates
    });

    result.should.be.an('object');
    result.exDividendDate.should.be.a('date');
  });

  it('supports multiple symbols', async () => {
    const download = sinon.stub()
      .usingPromise(BluebirdPromise)
      .resolves(getFile('quoteJson'));

    const stubbedSnapshot = proxyquire('./snapshot', {
      './yahooCrumb': { async getCrumb() { return 'crumb'; } },
      './utils': { download }
    }).default;

    const result = await stubbedSnapshot({
      symbols: [ 'TSLA', 'MSFT' ],
      fields: [ 's', 'n' ]
    });

    download.should.have.been.calledTwice;
    download.should.have.been.calledWithMatch(/TSLA$/);
    download.should.have.been.calledWithMatch(/MSFT$/);

    result.should.be.an('object');
    result.should.include.keys('TSLA', 'MSFT');
    assertValidSnapshotResult(result.TSLA);
    assertValidSnapshotResult(result.MSFT);
  });
});

export { assertValidSnapshotResult };

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import proxyquire from 'proxyquire';

import { parseAndGetCrumb } from './yahooCrumb';
import { assertValidHistoricalResult, assertValidSnapshotResult,
  getFile, STATIC_CRUMB } from '../tests/testUtils';

// for nodeify to work with stubbed out functions
import BluebirdPromise from 'bluebird';

const should = chai.should();
chai.use(chaiAsPromised);

const yahooCrumbStub = {
  async getCrumb() { return STATIC_CRUMB }
};

function utilsDownloadFixture(name) {
  return {
    // async download() { return getFile(name); }
    download: () => BluebirdPromise.resolve(getFile(name))
  }
}

function stubbedFor(name) {
  return {
    './yahooCrumb': yahooCrumbStub,
    './utils': utilsDownloadFixture(name)
  }
}

describe('index', () => {

  describe('historical', () => {

    it('correctly transforms current Yahoo response (2017-05-21)', async () => {

      const historical = proxyquire('./index', stubbedFor('historyCsv')).historical;
      const result = await historical({
        // Note, these aren't actually used in this test - data from a fixture
        symbol: 'AAPL',
        from: '2012-01-01'
      });

      assertValidHistoricalResult(result);

    });

  });

  describe('snapshot', () => {

    it('correctly transforms current Yahoo response (2017-05-21)', async () => {

      const snapshot = proxyquire('./index', stubbedFor('quoteJson')).snapshot;
      const result = await snapshot({
        // Note, these aren't actually used in this test - data from a fixture
        symbol: 'TSLA',
        fields: ['s', 'n', 'd1', 'l1', 'y', 'r']
      });

      assertValidSnapshotResult(result);

    });

  });

});

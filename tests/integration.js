/*
 * In the spec unit tests, we see if all our functions work as expected, given
 * the data they're expecting.  Here, we check if everything is working, which
 * is also testing that Yahoo is operating the same way we expect.
 */

import fs from 'fs';
import path from 'path';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import proxyquire from 'proxyquire';

import moment from 'moment';

import { assertValidHistoricalResult, assertValidSnapshotResult } from '../lib/index.spec.js';

import { historical } from '../lib/index';

const should = chai.should();
chai.use(chaiAsPromised);

const NETWORK_TIMEOUT = 10 * 1000;

const lastWeekStr = moment().subtract(7, 'days').format('YYYY-MM-DD');

if (process.env.INTEGRATION_TESTS)
describe('integration tests', () => {

  describe('historical', () => {

    it('works', async () => {
      const result = await historical({ symbol: 'TSLA', from: lastWeekStr });
      assertValidHistoricalResult(result);
    }).timeout(NETWORK_TIMEOUT);

  });

});

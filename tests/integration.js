/*
 * In the spec unit tests, we see if all our functions work as expected, given
 * the data they're expecting.  Here, we check if everything is working, which
 * is also testing that Yahoo is operating the same way we expect.
 */

import fs from 'fs';
import path from 'path';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import moment from 'moment';

import { assertValidHistoricalResult } from '../lib/historical.spec.js';
import { assertValidSnapshotResult } from '../lib/snapshot.spec.js';

import historical from '../lib/historical';

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

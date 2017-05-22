import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import proxyquire from 'proxyquire';

// for nodeify to work with stubbed out functions
import BluebirdPromise from 'bluebird';

import tough from 'tough-cookie';
import requestPromise from 'request-promise';

import _constants from './constants';
import { parseAndGetCrumb } from './yahooCrumb';
import { getFile, STATIC_CRUMB } from '../tests/testUtils';

const Cookie = tough.Cookie;

const should = chai.should();
chai.use(chaiAsPromised);

describe('yahooCrumb', () => {

  describe('getCrumb', () => {

    it('works with current Yahoo response (2017-05-21)', () => {
      const body = getFile('historyHtml');
      const crumb = parseAndGetCrumb(body);
      crumb.should.equal(STATIC_CRUMB);
    });

    it('gets a new crumb if an existing cookie is expired', async () => {
      const cookiejar = new requestPromise.jar();

      let fileToGet;
      const getCrumb = proxyquire('./yahooCrumb', {
        './utils': {
          cookiejar,
          download: () => BluebirdPromise.resolve({ body: getFile(fileToGet) }),
        }
      }).getCrumb;

      // create an un-expired cookie
      const cookie = new Cookie({
        key: 'B',
        value: 'notImportant',
        expires: new Date(Date.now() + 10000),
        domain: 'yahoo.com',
        path: '/',
      });
      // async method, but works async for the default memoryStore
      cookiejar.setCookie(cookie, _constants.HISTORICAL_CRUMB_URL);

      fileToGet = 'historyHtml';
      const initialCrumb = await getCrumb('IGNORED');

      // expire the cookie
      cookie.expires = new Date(Date.now() - 5000);
      // async method, but works async for the default memoryStore
      cookiejar.setCookie(cookie, _constants.HISTORICAL_CRUMB_URL);

      fileToGet = 'historyHtml2';
      const nextCrumb = await getCrumb('IGNORED');

      initialCrumb.should.not.equal(nextCrumb);
    });

  });

});

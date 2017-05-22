import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { parseAndGetCrumb } from './yahooCrumb';
import { getFile, STATIC_CRUMB } from '../tests/testUtils';

const should = chai.should();
chai.use(chaiAsPromised);

describe('yahooCrumb', () => {

  describe('getCrumb', () => {

    it('works with current Yahoo response (2017-05-21)', () => {
      const body = getFile('historyHtml');
      const crumb = parseAndGetCrumb(body);
      crumb.should.equal(STATIC_CRUMB);
    });

  });

});

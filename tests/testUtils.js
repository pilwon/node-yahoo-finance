import fs from 'fs';
import path from 'path';

// for nodeify to work with stubbed out functions
import BluebirdPromise from 'bluebird';

const fixturePath = (...args) => path.join('tests', 'fixtures', ...args);

const fixtures = {
  historyHtml: fixturePath('history.html'),     // crumb: STATIC_CRUMB
  historyHtml2: fixturePath('history2.html'),   // crumb: sxCZygzUaUK
  historyCsv: fixturePath('history_download_TSLA.csv'),
  quoteJson: fixturePath('quote_MSFT.json'),    // crumb: sxCZygzUaUK
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

export { getFile, STATIC_CRUMB, utilsDownloadFixture, stubbedFor };

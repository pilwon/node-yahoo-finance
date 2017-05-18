var Promise = require('bluebird');
var rp = require('request-promise');
var tough = require('tough-cookie');
var Cookie = tough.Cookie;

var _constants = require('./constants');
var _utils = require('./utils');

var cookiejar = new rp.jar();
var rpOpts = { resolveWithFullResponse: true };
var NEVER_SET = '#NEVER_SET';
var data = { cookiejar: cookiejar, crumb: NEVER_SET };

// Faster but probably more brittle option:
// var crumbRE = /"CrumbStore":\{"crumb":"(.+?)"\}/;

var dataRE = /^root.App.main = (\{.*\});$/m;
function parseAndGetCrumb(body) {
  var match = dataRE.exec(body);
  if (!match) {
    throw new Error("Could not match root.App.main line.  If this happens " +
      "consistently, Yahoo output has changed and you should open a bug " +
      "report.");
  }

  var data;
  try {
    data = JSON.parse(match[1]);
  } catch (err) {
    console.error(err);
    throw new Error("root.App.main line (or regexp) did not capture valid " +
      "JSON.  If this happens consistently, please open a bug report.");
  }

  var crumb;
  if (!data.context)
    throw new Error("root.Api.main JSON structure has changed.  If this " +
      "happens consistently, please open a bug report.");

  var dispatcher = data.context.dispatcher;
  crumb = dispatcher &&
    dispatcher.stores &&
    dispatcher.stores.CrumbStore &&
    dispatcher.stores.CrumbStore.crumb;

  if (!crumb) {
    console.warn('root.Api.main context.dispatcher.stores.CrumbStore.crumb ' +
      'structure no longer exists, please open an issue.');

    var plugins = data.context.plugins;
    crumb = plugins &&
      plugins.ServicePlugin &&
      plugins.ServicePlugin.xhrContent &&
      plugins.ServicePlugin.xhrContext.crumb;

    if (!crumb)
      throw new Error('root.Api.main ' +
        'context.plugins.ServicePlugin.xhrContext.crumb' +
        'structure no longer exists, please open an issue.')
  }

  return crumb;
}

function storeCookiesInJar(setCookieHeader, url, cookiejar) {
  var cookies;

  if (setCookieHeader instanceof Array) {
    cookies = setCookieHeader.map(Cookie.parse);
  } else {
    console.log('not an array?', setCookieHeader);
    cookies = [ Cookie.parse(setCookieHeader) ];
  }

  for (var i=0; i < cookies.length; i++) {
    // note: async, possible timing issues? TODO
    cookiejar.setCookie(cookies[i], url);
  }
}

function fetch(symbol) {
  var url = _constants.HISTORICAL_CRUMB_URL.replace(/\$SYMBOL/, symbol);
  return _utils.download(url, '', rpOpts)
    .then(function (res) {
      data.crumb = parseAndGetCrumb(res.body);
      storeCookiesInJar(res.headers['set-cookie'], url, cookiejar);
    })
    .catch(function(err){
      console.log(err);
    });
}

function getCrumb(symbol) {
  // no cookie / crumb DONE
  // cookie expired TODO
  // auth refused TODO in index
  if (data.crumb === NEVER_SET) {
    console.log('fetching cookie and crumb');
    return fetch(symbol).then(function() { return data.crumb; })
  } else {
    console.log('from cache');
    return Promise.resolve(data.crumb);
  }
}

/*
getData('MSFT')
  .then(result => console.log(result))
  .then(function() {
    getData('MSFT').then(result => console.log(result))
  });
*/

exports.jar = cookiejar;
exports.getCrumb = getCrumb;

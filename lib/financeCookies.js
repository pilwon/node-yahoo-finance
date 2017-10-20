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
    throw new Error("Could match root.App.main line.  If this happens more " +
      "one, Yahoo output has changed and you should open a bug report.");
  }

  var data = JSON.parse(match[1]);
  // return data.context.plugins.ServicePlugin.xhrContext.crumb);
  return data.context.dispatcher.stores.CrumbStore.crumb;
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

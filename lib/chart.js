var request = require('request');

/**
 * Method for getting chart data via yahoo API
 * @param {string} symbol 
 */
function chart(symbol) {
  return new Promise((resolve, reject) => {
    if (!symbol) {
      return reject('Symbol must not be falsey value');
    }

    var url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?region=US&lang=en-US&includePrePost=false&interval=2m&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance`;

    request.get(url, function (err, res, body) {
      if (err) {
        return reject(err);
      } else if (body) {
        return resolve(body);
      } else {
        return reject('Yahoo finance response not as expected');
      }
    });
  });
}

exports.__esModule = true;
exports.default = chart;
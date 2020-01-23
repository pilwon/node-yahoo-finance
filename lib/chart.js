var request = require('request');

/**
 * 
 * @param {string} symbol 
 */
function chart(symbol, cb) {
  return new Promise((resolve, reject) => {
    if (!symbol) {
      return reject('Symbol must not be falsey value');
    }

    var url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?region=US&lang=en-US&includePrePost=false&interval=2m&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance`;

    request.get(url, function (err, res, body) {
      return resolve(body);
    });
  });
}

exports.__esModule = true;
exports.default = chart;
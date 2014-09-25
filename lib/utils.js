var S = require('string');

function camelize(text) {
  return S(text)
    .slugify()
    .camelize()
    .s;
}

exports.camelize = camelize;

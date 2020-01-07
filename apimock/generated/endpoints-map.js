module.exports = new Map([
  ['GET_/v1/some/:id', require('../src/apis/some/get/index.js')],
  ['GET_/v1/foo/:id', require('../src/apis/foo/get/index.js')]
]);
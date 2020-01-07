module.exports = new Map([
  ['GET_/v1/some/:id', require.ensure([], ()=> require('../src/apis/some/get/index.js'))],
  ['GET_/v1/foo/:id', require.ensure([], ()=> require('../src/apis/foo/get/index.js'))]
]);
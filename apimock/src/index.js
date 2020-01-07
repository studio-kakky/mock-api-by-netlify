const endpointsMap = require('../generated/endpoints-map')
const paths = require('../generated/paths');

exports.handler = async (events) => {
  return {
    statusCode: 200,
    body: JSON.stringify(getSomeFunc()(events)),
  }
};

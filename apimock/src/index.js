const { Path } = require('path-parser');

const endpointsMap = require('../generated/endpoints-map');
const pathList = require('../generated/endpoint-paths');

exports.handler = async (events) => {
  const paths = pathList.map(v => new Path(v));
  const endpointKey = `${events.httpMethod}_${events.path.replace('^/api', '')}`;

  if (!endpointsMap.has(endpointKey)) {
    return {
      statusCode: 404,
      body: `NOT Found \n${endpointKey} \n${JSON.stringify(events)}`
    }
  }

  return {
    statusCode: 200,
    body: endpointsMap.get(endpointKey)(events),
  }
};

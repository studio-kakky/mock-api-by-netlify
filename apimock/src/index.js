const { Path } = require('path-parser');

const endpointsMap = require('../generated/endpoints-map');
const pathList = require('../generated/endpoint-paths');

const makeRequest = (events, targetPath) => {
  const pathWithParams = events.path.replace(/^\/api/, '');

  return {
    params: targetPath.test(pathWithParams) || {},
    body: events.body,
    query: events.queryStringParameters || {},
    headers: events.headers
  }
}

exports.handler = async (events) => {
  const paths = pathList.map(v => new Path(v));
  const targetPath = paths.find(v => v.test(events.path.replace(/^\/api/, '')));

  if (!targetPath) {
    return  {
      statusCode: 404,
      body: `NOT TargetPath Found \n${events.path} \n${JSON.stringify(events)}`
    }
  }

  const endpointKey = `${events.httpMethod}_${targetPath.path}`;

  if (!endpointsMap.has(endpointKey)) {
    return {
      statusCode: 404,
      body: `NOT Found \n${endpointKey} \n${JSON.stringify(events)}`
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(endpointsMap.get(endpointKey)(makeRequest(events, targetPath))),
  }
};

const { Path } = require('path-parser');

const makeRequest = (events, path) => {
  const pathWithParams = events.path.replace(/^\/api/, '');

  return {
    params: path.test(pathWithParams) || {},
    body: events.body,
    query: events.queryStringParameters || {},
    headers: events.headers
  }
};

exports.handler = async (events) => {
  const path = new Path(pathPattern);

  if (!methodMap.has(events.httpMethod)) {
    return {
      statusCode: 404,
      body: JSON.stringify(events)
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(methodMap.get(events.httpMethod)(makeRequest(events, path))),
  }
};

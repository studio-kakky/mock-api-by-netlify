const endpoints = require('./endpoints/endpoints-list.js');

exports.handler = async (events) => {
  const path = events.path.replace(/^\/index/, '');
  const endpoint = endpoints.find(v => v.url === path);

  if (!endpoint) {
    return {
      statusCode: 404,
      body: `${path} Endpoint Not Defined ${JSON.stringify(events)}`
    }
  }

  let endpointFunc;

  try {
    endpointFunc = require(endpoint.file);
  } catch {
    return {
      statusCode: 404,
      body: `${endpoint.file} Endpoint File Not Found ${JSON.stringify(events)}`
    }
  }


  return {
    statusCode: 200,
    body: JSON.stringify(endpointFunc(events)),
  }
};

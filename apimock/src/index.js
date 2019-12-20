const endpoints = require('./endpoints/endpoints-list');
const fs = require('fs');

exports.handler = async (events) => {
  const path = events.path.replace(/^api\//, '');
  const endpoint = endpoints.find(v => v.url === path);

  if (!endpoint) {
    return {
      statusCode: 404,
      body: `Endpoint Not Defined ${JSON.stringify(events)}`
    }
  }

  try {
    fs.statSync(endpoint.file)
  } catch {
    return {
      statusCode: 404,
      body: `Endpoint File Not Found ${JSON.stringify(events)}`
    }
  }

  const endpointFunc = require(endpoint.file);
  return {
    statusCode: 200,
    body: JSON.stringify(endpointFunc(event)),
  }
};

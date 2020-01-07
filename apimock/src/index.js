const endpoints = require('./endpoints/endpoints-list.js');
const someGet = require('./endpoints/some/get');

exports.handler = async (events) => {
  const path = events.path.replace(/^\/api/, '');
  //const endpoint = endpoints.find(v => v.url === path);
  const endpoint = endpoints[0]

  if (!endpoint) {
    return {
      statusCode: 404,
      body: `${path} api Endpoint Not Defined ${JSON.stringify(events)}`
    }
  }

  let endpointFunc = someGet;

  // try {
  //   endpointFunc = require(endpoint.file);
  // } catch {
  //   return {
  //     statusCode: 404,
  //     body: `${endpoint.file} Endpoint File Not Found ${JSON.stringify(events)}`
  //   }
  // }


  return {
    statusCode: 200,
    body: JSON.stringify(endpointFunc(events)),
  }
};

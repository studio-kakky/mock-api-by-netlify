exports.handler = async (events) => {
  return {
    statusCode: 200,
    body: JSON.stringify(events),
  }
};

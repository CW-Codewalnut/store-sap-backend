module.exports.format = (code, statusFlag, msg, data) => {
  const res = {
    code,
    status: statusFlag,
    message: msg,
    data,
  };
  return res;
};

module.exports.RESPONSE = {
  CODE: {
    200: 200,
    201: 201,
    400: 400,
    404: 404,
    440: 400,
    500: 500,
  },
  STATUS: {
    SUCCESS: 'success',
    FAILURE: 'failure',
  },
};

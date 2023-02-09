module.exports.format = (code, statusFlag, msg, data) => {
  const res = {
    code,
    status: statusFlag,
    message: msg,
    data,
  };
  return res;
};

const responseFormatter = (
  code: number,
  statusFlag: string,
  msg: string,
  data: any,
) => {
  const res = {
    code,
    status: statusFlag,
    message: msg,
    data,
  };
  return res;
};

const CODE = {
  200: 200,
  201: 201,
  400: 400,
  404: 404,
  440: 400,
  500: 500,
};

const STATUS = {
  SUCCESS: 'success',
  FAILURE: 'failure',
};

export { responseFormatter, CODE, STATUS };

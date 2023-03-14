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
  401: 401,
  404: 404,
  500: 500,
};

const STATUS = {
  FAILURE: 'failure',
  SUCCESS: 'success',
};

export { responseFormatter, CODE, STATUS };

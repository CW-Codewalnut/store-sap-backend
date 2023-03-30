const responseFormatter = (
  status: number,
  success: boolean,
  message: string,
  data: any,
) => {
  const res = {
    status,
    success,
    message,
    data,
  };
  return res;
};

const CODE = {
  200: 200,
  201: 201,
  400: 400,
  401: 401,
  422: 422,
  404: 404,
  500: 500,
};

const SUCCESS = {
  FALSE: false,
  TRUE: true,
};

export { responseFormatter, CODE, SUCCESS };

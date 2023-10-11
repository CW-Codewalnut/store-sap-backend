const checkResponsePropertiesExist = (res: any): boolean => {
  const hasStatus = Object.prototype.hasOwnProperty.call(res.body, 'status');
  const hasSuccess = Object.prototype.hasOwnProperty.call(res.body, 'success');
  const hasMessage = Object.prototype.hasOwnProperty.call(res.body, 'message');
  const hasData = Object.prototype.hasOwnProperty.call(res.body, 'data');

  return hasStatus && hasSuccess && hasMessage && hasData;
};

const checkResponseBodyValue = (
  res: any,
  expectedStatus: number,
  expectedSuccess: boolean,
  expectedMessage: string,
): boolean => {
  const statusMatch = res.body.status === expectedStatus;
  const successMatch = res.body.success === expectedSuccess;
  const messageMatch = res.body.message === expectedMessage;

  return statusMatch && successMatch && messageMatch;
};

export default checkResponsePropertiesExist;
export { checkResponseBodyValue };

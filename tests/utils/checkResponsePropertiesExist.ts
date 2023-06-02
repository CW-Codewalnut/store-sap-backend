const checkResponsePropertiesExist = (res: any): boolean => {
  const hasStatus = res.body.hasOwnProperty('status');
  const hasSuccess = res.body.hasOwnProperty('success');
  const hasMessage = res.body.hasOwnProperty('message');
  const hasData = res.body.hasOwnProperty('data');

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

const validateEmail = (email: string) => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
};

const getIdArrays = (data: any) => data.map((x: any) => x.id);

const dateFormat = (_date: string) => {
  const date = new Date(_date); // Create a new Date object with the current date and time
  const day = date.getDate().toString().padStart(2, '0'); // Get the day of the month as a two-digit string (e.g. "03")
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get the month as a two-digit string (e.g. "07"), adding 1 to account for 0-based indexing
  const year = date.getFullYear().toString(); // Get the year as a four-digit string (e.g. "2023")
  return `${day}.${month}.${year}`; // Concatenate the day, month, and year strings with the period separator
};

const convertFromDate = (_date: string) => {
  const date = new Date(_date);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  const year = date.getFullYear().toString();
  return `${year}-${month}-${day} 00:00:00.000 +05:30`;
};

const convertToDate = (_date: string) => {
  const date = new Date(_date);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${year}-${month}-${day} 23:59:59.999 +05:30`;
};

export { validateEmail, getIdArrays, dateFormat, convertFromDate, convertToDate };

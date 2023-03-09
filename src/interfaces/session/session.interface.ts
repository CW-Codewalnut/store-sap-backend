interface DefaultFields {
  data: string;
  expires: Date;
}

interface ExtendReturnData {
  [column: string]: any;
}

export { DefaultFields, ExtendReturnData };

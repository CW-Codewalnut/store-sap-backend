interface sessionActivityArgs {
  req: any;
  userId: string;
  callBackFn: (args: any) => void;
}

export default sessionActivityArgs;

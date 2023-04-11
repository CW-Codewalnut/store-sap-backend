interface sessionActivityArgs {
  req: any;
  userId: string;
  sessionId: string;
  callBackFn: (args: any) => void;
}

export default sessionActivityArgs;

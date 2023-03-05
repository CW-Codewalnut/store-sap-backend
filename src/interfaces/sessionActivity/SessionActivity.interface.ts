interface SessionActivityArgs {
  req: any;
  userId: String;
}

interface CallbackFnType {
  (myArgument: any): void;
}

export { SessionActivityArgs, CallbackFnType };

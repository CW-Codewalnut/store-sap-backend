import 'express-session';

type Cookie = {
  originalMaxAge: number;
  expires: Date | null;
  secure?: boolean;
  httpOnly?: boolean;
  domain?: string;
  path?: string;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
};

declare module 'express-session' {
  interface SessionData {
    userId: string;
    activePlantId: string;
    isAllowedNewTransaction: boolean;
    cookie: Cookie;
  }
}

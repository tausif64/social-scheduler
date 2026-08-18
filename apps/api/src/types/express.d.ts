import type { Session } from "better-auth";
import type { User } from "better-auth";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      session?: Session;
    }
  }
}

export {};

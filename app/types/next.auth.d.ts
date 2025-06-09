import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      username: string;
    };
  }

  interface User extends DefaultUser {
    id: string;
    name: string;
    email: string;
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    name: string;
    email: string;
    username: string;
  }
}
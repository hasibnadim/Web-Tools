import { ObjectId } from "mongodb";

export interface Session {
    userId:ObjectId 
    expires:Date
    lastActivity:Date
}
export interface User {
  firstName: string;
  lastName: string | null;
  picture: string;
  emailVerified: boolean;
  iss: string;
  email: string;
  persona?: string | null;
  password: string | null;
}
export interface GoogleUser {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}

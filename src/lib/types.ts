// Common types that can be used on both client and server
// These are separate from MongoDB-specific types to avoid client-side import issues

import { Session, User } from "@/service/auth/interface";



// Client-safe document type
export type ClientDoc<T> = {
  _id: string;
} & T;

// User type for client components
export type ClientUser = ClientDoc<User>;

// Session type for client components
export type ClientSession = ClientDoc<Session>; 
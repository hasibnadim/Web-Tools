// Common types that can be used on both client and server
// These are separate from MongoDB-specific types to avoid client-side import issues

export interface BaseUser {
  firstName: string;
  lastName: string | null;
  picture: string;
  emailVerified: boolean;
  iss: string;
  email: string;
  persona?: string | null;
  password: string | null;
}

export interface BaseSession {
  userId: string;
  expires: Date;
  lastActivity: Date;
}

// Client-safe document type
export type ClientDoc<T> = {
  _id: string;
} & T;

// User type for client components
export type ClientUser = ClientDoc<BaseUser>;

// Session type for client components
export type ClientSession = ClientDoc<BaseSession>; 
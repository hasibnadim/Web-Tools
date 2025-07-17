"use server";
import { cookies } from "next/headers";
import { ObjectId, WithId } from "mongodb";
import db, { CName, Doc } from "../mongodb";
import { GoogleUser, Session, User } from "./interface";
import { OAuth2Client } from "google-auth-library";
import { 
  validateEmail, 
  validateUserId, 
  validatePersona, 
  isSessionExpired, 
  AuthError,
  handleAuthError 
} from "@/lib/auth-utils";

// Constants
const SESSION_DURATION_DAYS = 7;
const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

// Error codes
const ERROR_CODES = {
  INVALID_CREDENTIAL: 'INVALID_CREDENTIAL',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  INVALID_USER_ID: 'INVALID_USER_ID',
  UPDATE_FAILED: 'UPDATE_FAILED',
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const;

/**
 * Creates a new session for a user with Google OAuth
 */
export const createSession = async (credential: string): Promise<boolean> => {
  try {
    if (!credential) {
      throw new AuthError('Credential is required', ERROR_CODES.INVALID_CREDENTIAL);
    }

    const OAuth = new OAuth2Client(
      process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID as string
    );

    const ticket = await OAuth.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload() as GoogleUser | null;
    if (!payload) {
      throw new AuthError('Invalid Google token', ERROR_CODES.INVALID_CREDENTIAL);
    }

    if (!validateEmail(payload.email)) {
      throw new AuthError('Invalid email address', ERROR_CODES.INVALID_CREDENTIAL);
    }

    // Find or create user
    let user = await db
      .collection<User>(CName.User)
      .findOne({ email: payload.email });

    if (!user) {
      user = await createUser({
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture,
        emailVerified: payload.email_verified,
        iss: payload.iss,
        password: null,
      });
    }

    // Create session
    const session = await db.collection<Session>(CName.Session).insertOne({
      userId: user._id,
      expires: new Date(Date.now() + SESSION_DURATION_MS),
      lastActivity: new Date(),
    });

    if (!session.insertedId) {
      throw new AuthError('Failed to create session', ERROR_CODES.UPDATE_FAILED);
    }

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("baw_user_token", session.insertedId.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION_MS / 1000,
    });

    return true;
  } catch (error) {
    console.error('Error creating session:', error);
    return false;
  }
};

/**
 * Deletes the current user session
 */
export const deleteSession = async (): Promise<void> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("baw_user_token")?.value;
    
    if (token) {
      try {
        await db.collection(CName.Session).deleteOne({
          _id: new ObjectId(token),
        });
      } catch {
        // Ignore invalid ObjectId errors
      }
    }
    
    cookieStore.delete("baw_user_token");
  } catch (error) {
    console.error('Error deleting session:', error);
 
  }
};

/**
 * Creates a new user in the database
 */
export const createUser = async (user: User): Promise<WithId<User>> => {
  try {
    if (!validateEmail(user.email)) {
      throw new AuthError('Invalid email address', ERROR_CODES.INVALID_CREDENTIAL);
    }

    const response = await db.collection(CName.User).insertOne(user);
    const _id = response.insertedId;
    
    return {
      _id,
      ...user,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw handleAuthError(error);
  }
};

/**
 * Interface for session data returned to client
 */
export interface IRgetSession {
  userId: string;
  _id: string;
  lastActivity: Date;
  expires: Date;
}

/**
 * Gets the current session or a specific user's session
 */
export const getSession = async (userId?: string): Promise<IRgetSession | null> => {
  try {
    if (userId && !validateUserId(userId)) {
      throw new AuthError('Invalid user ID', ERROR_CODES.INVALID_USER_ID);
    }

    let session: (Session & { _id: ObjectId }) | null = null;

    if (userId) {
      session = await db
        .collection<Session>(CName.Session)
        .findOne(
          { userId: new ObjectId(userId) },
          { sort: { lastActivity: -1 } }
        );
    } else {
      const cookieStore = await cookies();
      const cookie = cookieStore.get("baw_user_token");
      
      if (!cookie?.value) return null;
      
      session = await db
        .collection<Session>(CName.Session)
        .findOne({ _id: new ObjectId(cookie.value) });
    }

    if (!session) return null;

    // Check if session is expired
    if (isSessionExpired(session)) {
      // Clean up expired session
      await db.collection(CName.Session).deleteOne({ _id: session._id });
      return null;
    }

    // Update last activity
    await db.collection(CName.Session).updateOne(
      { _id: session._id },
      { $set: { lastActivity: new Date() } }
    );

    return {
      ...session,
      userId: session.userId.toString(),
      _id: session._id.toString(),
    };
  } catch (error) {
    console.error('Error getting session:', error);
     return null;
  }
};

/**
 * Gets user data by ID or current session
 */
export const getUser = async (id?: string): Promise<Doc<User> | null> => {
  try {
    if (id && !validateUserId(id)) {
      throw new AuthError('Invalid user ID', ERROR_CODES.INVALID_USER_ID);
    }

    let user: (User & { _id: ObjectId }) | null = null;

    if (id) {
      user = await db
        .collection<User>(CName.User)
        .findOne({ _id: new ObjectId(id) });
    } else {
      const session = await getSession();
      if (!session) return null;
      
      user = await db
        .collection<User>(CName.User)
        .findOne({ _id: new ObjectId(session.userId) });
    }

    if (!user) return null;

    return {
      ...user,
      _id: user._id.toString(),
    };
  } catch (error) {
    console.error('Error getting user:', error);
     return null;
  }
};

/**
 * Updates user data
 */
export const updateUser = async (userId: string, updates: Partial<User>): Promise<boolean> => {
  try {
    if (!validateUserId(userId)) {
      throw new AuthError('Invalid user ID', ERROR_CODES.INVALID_USER_ID);
    }

    // Validate persona if it's being updated
    if (updates.persona !== undefined) {
      const validation = validatePersona(updates.persona || '');
      if (!validation.isValid) {
        throw new AuthError(validation.error!, ERROR_CODES.INVALID_CREDENTIAL);
      }
    }

    // Validate email if it's being updated
    if (updates.email && !validateEmail(updates.email)) {
      throw new AuthError('Invalid email address', ERROR_CODES.INVALID_CREDENTIAL);
    }

    const result = await db
      .collection<User>(CName.User)
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: updates }
      );

    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating user:', error);
    throw handleAuthError(error);
  }
};

/**
 * Checks if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const session = await getSession();
    return session !== null;
  } catch {
    return false;
  }
};

/**
 * Gets current authenticated user
 */
export const getCurrentUser = async (): Promise<Doc<User> | null> => {
  try {
    return await getUser();
  } catch {
    return null;
  }
};

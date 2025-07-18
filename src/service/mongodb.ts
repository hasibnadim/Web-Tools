import { MongoClient } from "mongodb";
import { Session, User } from "./auth/interface";
import { PublicText } from "./publicText/interface";
const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB as string;
const dbClient = new MongoClient(uri);
const db = dbClient.db(dbName);

export enum CName {
    User = "users",
    Session = "sessions",
    PublicText = "public_text",
}
export type Doc<T> = { _id: string } & T;
export const migrate = async () => {
    // CName.User
    await db.collection<User>(CName.User).createIndex({ email: 1 }, { unique: true });
    // CName.Session
    await db.collection<Session>(CName.Session).createIndex({ userId: 1 }, { unique: false });
    // CName.PublicText
    await db.collection<PublicText>(CName.PublicText).createIndex({ id: 1 }, { unique: true });
    await db.collection<PublicText>(CName.PublicText).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
};

export default db;

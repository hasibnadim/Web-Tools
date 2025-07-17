import { MongoClient } from "mongodb";
import { Session, User } from "./auth/interface";
const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB as string;
const dbClient = new MongoClient(uri);
const db = dbClient.db(dbName);

export enum CName {
    User = "users",
    Session = "sessions",
}
export type Doc<T> = { _id: string } & T;
export const migrate = async () => {
    // CName.User
    await db.collection<User>(CName.User).createIndex({ email: 1 }, { unique: true });
    // CName.Session
    await db.collection<Session>(CName.Session).createIndex({ userId: 1 }, { unique: false });
};

export default db;

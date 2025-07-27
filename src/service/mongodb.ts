import { MongoClient } from "mongodb";
import { Session, User } from "./auth/interface";
import { PublicText } from "./publicText/interface"; 
import { IQatrat } from "./qatrat/interface";
const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB as string;
const dbClient = new MongoClient(uri);
const db = dbClient.db(dbName);

export enum CName {
    User = "users",
    Session = "sessions",
    PublicText = "public_text",
    Qatrat = "qatrat",
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
    await db.collection<PublicText>(CName.PublicText).createIndex({ userId: 1 }, { unique: false });
    
    // CName.Qatrat 
    await db.collection<IQatrat>(CName.Qatrat).createIndex({ author: 1 }, { unique: false }); 
    await db.collection<IQatrat>(CName.Qatrat).createIndex({ isPublic: 1 }, { unique: false });
    await db.collection<IQatrat>(CName.Qatrat).createIndex({ overview: "text" }, { name: "overview_text_search" });
};

export default db;

'use server'
import db, { CName } from "../mongodb";
import { PublicFile, PublicText } from "./interface";
 
const getUniqueId = async (): Promise<number> => {
    // random 4 digits and check if it is already in the database
    const id = Math.floor(1000 + Math.random() * 9000);
    const existing = await db.collection<PublicText>(CName.PublicText).findOne({ id });
    if (existing) {
        return getUniqueId();
    }
    return id;
}
export const  saveText = async (text: string, language: string):Promise<number> => {
    // Generate shortest unused ID in the order: A-Z, a-z, 0-9
    // Optimized: Generate all possible IDs of increasing length, query all at once, pick the first unused.
    const id = await getUniqueId();
    const publicText: PublicText = {
        id,
        text,
        language,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    }
    await db.collection<PublicText>(CName.PublicText).insertOne(publicText);
    return publicText.id;
}
export const saveFile = async (base64: string,name:string): Promise<number> => {
    const id = await getUniqueId();
    const publicFile: PublicFile = {
        id,
        file: base64, // Store base64 string directly instead of converting to Blob
        name,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 hours
    }
    await db.collection<PublicFile>(CName.PublicText).insertOne(publicFile);
    return publicFile.id;
}
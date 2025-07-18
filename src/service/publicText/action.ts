'use server'
import db, { CName } from "../mongodb";
import { PublicText } from "./interface";

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export const  saveText = async (text: string, language: string):Promise<string> => {
    // Generate shortest unused ID in the order: A-Z, a-z, 0-9
    // Optimized: Generate all possible IDs of increasing length, query all at once, pick the first unused.
    let shortestId = '';
    const collection = db.collection<PublicText>(CName.PublicText);
    outer: for (let len = 1; ; len++) {
        // Generate all possible IDs of this length
        const total = Math.pow(chars.length, len);
        const ids: string[] = [];
        for (let n = 0; n < total; n++) {
            let id = '';
            let x = n;
            for (let i = 0; i < len; i++) {
                id = chars[x % chars.length] + id;
                x = Math.floor(x / chars.length);
            }
            ids.push(id);
        }
        // Query all at once
        const existing = await collection.find({ id: { $in: ids } }).project({ id: 1 }).toArray();
        const used = new Set(existing.map(doc => doc.id));
        const unused = ids.find(id => !used.has(id));
        if (unused) {
            shortestId = unused;
            break outer;
        }
    }
    const publicText: PublicText = {
        id: shortestId,
        text,
        language,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000)
    }
    await collection.insertOne(publicText);
    return publicText.id;
}
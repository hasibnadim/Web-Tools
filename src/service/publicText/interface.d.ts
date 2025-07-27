import { ObjectId } from "mongodb";

export interface PublicText {
    id: number;
    text: string;
    language: string;
    createdAt: Date; 
    userId? : ObjectId;
    isPublic: boolean;
    expiresAt: Date | null; // 72 hours
}
export interface PublicFile {
    id: number;
    file: string;
    name: string;
    createdAt: Date;
    expiresAt: Date; // 8 hours
}
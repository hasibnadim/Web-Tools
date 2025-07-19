export interface PublicText {
    id: number;
    text: string;
    language: string;
    createdAt: Date;
    expiresAt: Date; // 72 hours
}
export interface PublicFile {
    id: number;
    file: string;
    name: string;
    createdAt: Date;
    expiresAt: Date; // 8 hours
}
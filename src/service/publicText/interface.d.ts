export interface PublicText {
    id: string;
    text: string;
    language: string;
    createdAt: Date;
    expiresAt: Date; // 72 hours
}
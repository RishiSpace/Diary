export interface User {
    id: string;
    username: string;
    passwordHash: string; // Store hashed password for security
    createdAt: Date;
}

export interface Account {
    id: string;
    username: string;
    publicKey: JsonWebKey;
    privateKey: JsonWebKey;
}

export interface DiaryEntry {
    id: string;
    accountId: string;
    date: string;
    title: string; // New: Title for the note
    content: string; // Encrypted
}
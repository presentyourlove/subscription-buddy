import type * as admin from 'firebase-admin';

export interface Migration {
    name: string;
    up: (db: admin.firestore.Firestore) => Promise<void>;
    down: (db: admin.firestore.Firestore) => Promise<void>;
}

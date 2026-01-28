
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Initialize Firebase Admin (Assumes GOOGLE_APPLICATION_CREDENTIALS or default credentials)
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();
const MIGRATIONS_COLLECTION = '_migrations';

// Helper to resolve paths in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to migrations directory
const MIGRATIONS_DIR = path.resolve(__dirname, '../packages/core/src/migrations');

interface MigrationDoc {
    id: string; // The filename
    appliedAt: admin.firestore.Timestamp;
}

async function runMigrations() {
    console.log('Starting database migrations...');

    if (!fs.existsSync(MIGRATIONS_DIR)) {
        console.error(`Migrations directory not found at: ${MIGRATIONS_DIR}`);
        process.exit(1);
    }

    // 1. Get all migration files
    const files = fs.readdirSync(MIGRATIONS_DIR)
        .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts') && file !== 'types.ts' && file !== 'index.ts')
        .sort(); // Ensure sorted by name (timestamp/number prefix)

    console.log(`Found ${files.length} migration files.`);

    // 2. Get applied migrations
    const snapshot = await db.collection(MIGRATIONS_COLLECTION).get();
    const appliedMigrationIds = new Set(snapshot.docs.map(doc => doc.id));

    // 3. Filter pending migrations
    const pendingMigrations = files.filter(file => !appliedMigrationIds.has(file));

    if (pendingMigrations.length === 0) {
        console.log('No pending migrations.');
        return;
    }

    console.log(`Found ${pendingMigrations.length} pending migrations:`, pendingMigrations);

    // 4. Execute pending migrations
    for (const file of pendingMigrations) {
        console.log(`Running migration: ${file}...`);
        const filePath = path.join(MIGRATIONS_DIR, file);

        try {
            // Dynamic import
            const migrationModule = await import(filePath);
            const migration = migrationModule.migration;

            if (!migration || typeof migration.up !== 'function') {
                throw new Error(`Invalid migration file: ${file}. Must export 'migration' object with 'up' function.`);
            }

            // Run 'up'
            await migration.up(db);

            // Record success
            await db.collection(MIGRATIONS_COLLECTION).doc(file).set({
                appliedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log(`Successfully applied: ${file}`);
        } catch (error) {
            console.error(`Failed to apply migration: ${file}`, error);
            process.exit(1); // Stop on first failure
        }
    }

    console.log('All migrations completed successfully.');
}

runMigrations().catch(err => {
    console.error('Migration runner failed:', err);
    process.exit(1);
});

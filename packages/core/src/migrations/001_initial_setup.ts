import type { Migration } from './types';

export const migration: Migration = {
    name: '001_initial_setup',
    up: async (db) => {
        // Example: Create a collection or set some initial data
        // await db.collection('users').doc('admin').set({ role: 'admin' });
        console.log('Running initial setup migration');
    },
    down: async (db) => {
        // Revert changes
        console.log('Reverting initial setup migration');
    }
};

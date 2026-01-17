const { exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("🔥 Firestore Restoration Tool 🔥");
console.log("--------------------------------");
console.log("⚠️  WARNING: This will overwrite existing data in the target database.");
console.log("Assumption: You have a valid backup in your GCS bucket.");
console.log("");

rl.question('Enter the full GCS URI of the backup (e.g., gs://my-bucket/backup-2024-01-01T00:00:00Z): ', (gcsUri) => {
    if (!gcsUri.startsWith('gs://')) {
        console.error("❌ Error: Valid URI must start with gs://");
        rl.close();
        return;
    }

    console.log(`\nPreparing to import from: ${gcsUri}`);
    rl.question('Are you sure you want to proceed? (yes/no): ', (answer) => {
        if (answer.toLowerCase() !== 'yes') {
            console.log("Operation cancelled.");
            rl.close();
            return;
        }

        console.log("\n🚀 Starting import operation via gcloud...");
        const command = `gcloud firestore import ${gcsUri}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`ℹ️  gcloud output: ${stderr}`);
            }
            console.log(`✅ Restore operation initiated successfully! Check GCP Console for progress.`);
            rl.close();
        });
    });
});

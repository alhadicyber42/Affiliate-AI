// Database Migration Script
// Run this to automatically setup database in Supabase

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const SUPABASE_URL = 'https://xufgwfnrmqijshgoihot.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTY2MzM5NCwiZXhwIjoyMDg1MjM5Mzk0fQ.Y5MADdvP7e3ORyXPnA-ViloGIbGF6KbkPAHiM4j4FOg';

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function runMigration() {
    console.log('🚀 Starting database migration...\n');

    try {
        // Read SQL file
        const sqlPath = path.join(__dirname, 'database', 'schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('📄 SQL file loaded');
        console.log('📊 Executing migration...\n');

        // Split SQL into individual statements
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i] + ';';
            
            // Skip comments
            if (statement.startsWith('--')) continue;

            try {
                const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
                
                if (error) {
                    // Some errors are expected (like "already exists")
                    if (error.message.includes('already exists')) {
                        console.log(`⚠️  Statement ${i + 1}: Already exists (skipped)`);
                    } else {
                        console.error(`❌ Statement ${i + 1}: ${error.message}`);
                        errorCount++;
                    }
                } else {
                    successCount++;
                    console.log(`✅ Statement ${i + 1}: Success`);
                }
            } catch (err) {
                console.error(`❌ Statement ${i + 1}: ${err.message}`);
                errorCount++;
            }
        }

        console.log('\n📊 Migration Summary:');
        console.log(`✅ Successful: ${successCount}`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log(`⚠️  Skipped: ${statements.length - successCount - errorCount}`);

        // Verify tables created
        console.log('\n🔍 Verifying tables...');
        await verifyTables();

        console.log('\n✅ Migration completed!');
        console.log('\n📝 Next steps:');
        console.log('1. Restart your backend server');
        console.log('2. Register a new account in the app');
        console.log('3. Try extracting a product');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

async function verifyTables() {
    const expectedTables = [
        'profiles',
        'products',
        'scripts',
        'script_modules',
        'videos',
        'analytics',
        'ab_tests',
        'ab_test_variants'
    ];

    for (const table of expectedTables) {
        try {
            const { count, error } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });

            if (error) {
                console.log(`❌ Table '${table}': Not found or error`);
            } else {
                console.log(`✅ Table '${table}': Exists (${count || 0} rows)`);
            }
        } catch (err) {
            console.log(`❌ Table '${table}': ${err.message}`);
        }
    }
}

// Run migration
runMigration();

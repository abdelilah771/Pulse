const postgres = require('postgres');
require('dotenv').config({ path: '.env' });

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

async function migrate() {
    await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS description TEXT`;
    await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS time_slot TEXT NOT NULL DEFAULT 'morning'`;
    console.log('Migration OK: added description and time_slot columns');
    await sql.end();
}

migrate().catch(e => { console.error(e); process.exit(1); });

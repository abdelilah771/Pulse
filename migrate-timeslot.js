const postgres = require('postgres');
require('dotenv').config({ path: '.env' });

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

async function migrate() {
    // Add avatar_url to users
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT`;

    // Create task_assignees junction table
    await sql`
        CREATE TABLE IF NOT EXISTS task_assignees (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT NOW() NOT NULL
        )
    `;

    // Add unique index to prevent duplicate assignments
    await sql`
        CREATE UNIQUE INDEX IF NOT EXISTS task_assignee_unique_idx
        ON task_assignees(task_id, user_id)
    `;

    // Add index for faster lookups by task
    await sql`
        CREATE INDEX IF NOT EXISTS task_assignee_task_idx
        ON task_assignees(task_id)
    `;

    console.log('Migration OK: avatar_url + task_assignees table');
    await sql.end();
}

migrate().catch(e => { console.error(e); process.exit(1); });

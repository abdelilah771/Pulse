const { Client } = require('pg');

const connectionString = "postgresql://postgres.hqbkapyqmxorvzccoval:64INb2ufEJXJdVjC@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1";

const client = new Client({
    connectionString,
});

async function run() {
    try {
        await client.connect();
        console.log("Connected successfully!");
        const res = await client.query('SELECT NOW()');
        console.log("Query result:", res.rows);
    } catch (err) {
        console.error("Connection error:", err);
    } finally {
        await client.end();
    }
}

run();

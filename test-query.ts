import { db } from "./src/db/index.js";
import { users } from "./src/db/schema.js";
import { eq } from "drizzle-orm";

async function run() {
    try {
        const id = "c6c0e107-3006-4ca4-b32b-2f99d4657a3c";
        console.log("Querying...");
        const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
        console.log("Result:", result);
        process.exit(0);
    } catch (e) {
        console.error("DB Error:", e);
        process.exit(1);
    }
}
run();

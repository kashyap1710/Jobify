import { db } from "./src/db/index.js";
import { sql } from "drizzle-orm";

const checkColumns = async () => {
    try {
        const result = await db.execute(sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users';
        `);
        console.log("Columns:", result.rows);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkColumns();

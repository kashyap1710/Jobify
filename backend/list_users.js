import { db } from "./src/db/index.js";
import { users } from "./src/db/schema.js";
import { desc } from "drizzle-orm";

const listUsers = async () => {
  try {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(5);
    console.log(allUsers);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

listUsers();

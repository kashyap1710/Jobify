import { db } from "./src/db/index.js";
import { users } from "./src/db/schema.js";
import { eq } from "drizzle-orm";

const checkDupes = async () => {
  const email = "abc@gmail.com";
  const all = await db.select().from(users).where(eq(users.email, email));
  console.log("Found:", all.length, "users");
  console.log(JSON.stringify(all, null, 2));
  process.exit(0);
};

checkDupes();

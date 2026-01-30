import { db } from "./src/db/index.js";
import { users } from "./src/db/schema.js";
import { eq } from "drizzle-orm";

const fixRole = async () => {
  try {
    const email = "kashyapbhesdadia1710@gmail.com";
    console.log(`Updating role for ${email}...`);

    const result = await db.update(users)
      .set({ roleName: "EMPLOYER" })
      .where(eq(users.email, email))
      .returning();

    console.log("Update result:", result);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

fixRole();

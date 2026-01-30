import { db } from "./src/db/index.js";
import { users } from "./src/db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const resetPass = async () => {
  try {
    const email = "abc@gmail.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email))
      .returning();

    console.log("Reset Result:", result);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

resetPass();

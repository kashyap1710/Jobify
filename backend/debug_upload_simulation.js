import { db } from "./src/db/index.js";
import { users } from "./src/db/schema.js";
import { eq } from "drizzle-orm";

const simulateUpload = async () => {
    const userId = "3e031651-ef3e-4165-ba1b-4c196dfd3164"; // ram's ID
    const resumePath = "/uploads/test-resume.pdf";

    console.log(`Updating user ${userId} with resume ${resumePath}...`);

    try {
        const result = await db.update(users)
            .set({ resume: resumePath })
            .where(eq(users.id, userId))
            .returning();
        
        console.log("Update Success:", result);
        process.exit(0);
    } catch (error) {
        console.error("Update Failed:", error);
        process.exit(1);
    }
};

simulateUpload();

import { db, pool } from "./index.js";
import { user } from "./schema.js";
import { eq } from "drizzle-orm";
async function makeSuperadmin() {
    const email = process.argv[2];
    if (!email) {
        console.error("Please provide an email address: npm run db:superadmin <email>");
        process.exit(1);
    }
    console.log(`Setting role 'superadmin' for user: ${email}`);
    const result = await db
        .update(user)
        .set({ role: "superadmin" })
        .where(eq(user.email, email))
        .returning();
    if (result.length === 0) {
        console.error(`User with email ${email} not found.`);
    }
    else {
        console.log(`✅ Successfully updated role for ${email} to 'superadmin'`);
    }
    await pool.end();
}
makeSuperadmin().catch((err) => {
    console.error("❌ Failed:", err);
    process.exit(1);
});

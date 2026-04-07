import { db, pool } from "./index.js";
import { categories, user } from "./schema.js";
import { auth } from "../auth/index.js";
import { eq } from "drizzle-orm";
import "dotenv/config";
const defaultCategories = [
    {
        name: "Food & Dining",
        icon: "restaurant",
        description: "Groceries, restaurants",
        color: "blue",
        type: "expense",
        isDefault: true,
    },
    {
        name: "Shopping",
        icon: "shopping_bag",
        description: "Clothes, electronics",
        color: "purple",
        type: "expense",
        isDefault: true,
    },
    {
        name: "Transport",
        icon: "commute",
        description: "Fuel, public transit",
        color: "orange",
        type: "expense",
        isDefault: true,
    },
    {
        name: "Utilities",
        icon: "bolt",
        description: "Bills, internet",
        color: "emerald",
        type: "expense",
        isDefault: true,
    },
    {
        name: "Housing",
        icon: "home",
        description: "Rent, utilities, maintenance",
        color: "blue",
        type: "expense",
        isDefault: true,
    },
    {
        name: "Entertainment",
        icon: "movie",
        description: "Movies, games, events",
        color: "purple",
        type: "expense",
        isDefault: true,
    },
    {
        name: "Health",
        icon: "medical_services",
        description: "Insurance, pharmacy",
        color: "teal",
        type: "expense",
        isDefault: true,
    },
    {
        name: "Income",
        icon: "payments",
        description: "Salary, freelance, investments",
        color: "green",
        type: "income",
        isDefault: true,
    },
];
async function seed() {
    console.log("🌱 Seeding default categories...");
    for (const cat of defaultCategories) {
        await db
            .insert(categories)
            .values({
            userId: null, // system default
            ...cat,
        })
            .onConflictDoNothing();
    }
    console.log(`✅ Seeded ${defaultCategories.length} default categories`);
    console.log("🌱 Seeding superadmin user...");
    const superadminEmail = process.env.SUPERADMIN_EMAIL || "superadmin@financetracker.local";
    const superadminPassword = process.env.SUPERADMIN_PASSWORD || "supersecret123";
    try {
        // Attempt to register the superadmin using Better Auth
        await auth.api.signUpEmail({
            body: {
                email: superadminEmail,
                password: superadminPassword,
                name: "Super Administrator",
            },
        });
        console.log(`✅ Created superadmin account: ${superadminEmail}`);
    }
    catch (e) {
        if (e.message?.includes("already exists") || e.status === 400) {
            console.log(`ℹ️ Superadmin account (${superadminEmail}) already exists.`);
        }
        else {
            console.warn("⚠️ Could not create superadmin account via API:", e.message);
        }
    }
    // Ensure the user has the 'superadmin' role using direct DB update
    try {
        await db.update(user).set({ role: "superadmin" }).where(eq(user.email, superadminEmail));
        console.log(`✅ Granted 'superadmin' role to ${superadminEmail}`);
    }
    catch (e) {
        console.error("❌ Failed to grant superadmin role:", e);
    }
    await pool.end();
}
seed().catch((err) => {
    console.error("❌ Seeds failed:", err);
    process.exit(1);
});

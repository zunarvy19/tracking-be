import { db } from "../db/index.js";
import { categories } from "../db/schema.js";
import { eq, and, or, isNull } from "drizzle-orm";
export const categoryService = {
    async list(user) {
        // Return system defaults + user's custom categories
        const result = await db
            .select()
            .from(categories)
            .where(or(isNull(categories.userId), eq(categories.userId, user.id)))
            .orderBy(categories.isDefault, categories.name);
        return result;
    },
    async create(user, data) {
        const result = await db
            .insert(categories)
            .values({
            userId: user.id,
            name: data.name,
            icon: data.icon,
            description: data.description,
            color: data.color,
            type: data.type || "expense",
            isDefault: false,
        })
            .returning();
        return result[0];
    },
    async update(user, id, data) {
        // Determine which categories the user is allowed to update
        let accessCondition;
        if (user.role === "superadmin") {
            // Superadmin can update system defaults (userId = null) AND their own categories (userId = user.id)
            accessCondition = or(isNull(categories.userId), eq(categories.userId, user.id));
        }
        else {
            // Regular users can ONLY update their own categories
            accessCondition = eq(categories.userId, user.id);
        }
        const result = await db
            .update(categories)
            .set(data)
            .where(and(eq(categories.id, id), accessCondition))
            .returning();
        return result[0] || null;
    },
    async delete(user, id) {
        // Determine which categories the user is allowed to delete
        let accessCondition;
        if (user.role === "superadmin") {
            // Superadmin can delete system defaults (userId = null) AND their own categories (userId = user.id)
            accessCondition = or(isNull(categories.userId), eq(categories.userId, user.id));
        }
        else {
            // Regular users can ONLY delete their own categories
            accessCondition = eq(categories.userId, user.id);
        }
        const result = await db
            .delete(categories)
            .where(and(eq(categories.id, id), accessCondition))
            .returning();
        return result[0] || null;
    },
};

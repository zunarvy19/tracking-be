import { db } from "../db/index.js";
import { categories } from "../db/schema.js";
import { eq, and, or, isNull } from "drizzle-orm";

export interface CreateCategoryDTO {
  name: string;
  icon: string;
  description?: string;
  color?: string;
  type?: "income" | "expense" | "both";
}

export const categoryService = {
  async list(user: { id: string; role?: string | null }) {
    // Return system defaults + user's custom categories
    const result = await db
      .select()
      .from(categories)
      .where(or(isNull(categories.userId), eq(categories.userId, user.id)))
      .orderBy(categories.isDefault, categories.name);

    return result;
  },

  async create(user: { id: string; role?: string | null }, data: CreateCategoryDTO) {
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

  async update(user: { id: string; role?: string | null }, id: string, data: Partial<CreateCategoryDTO>) {
    // Determine which categories the user is allowed to update
    let accessCondition;
    if (user.role === "superadmin") {
      // Superadmin can update system defaults (userId = null) AND their own categories (userId = user.id)
      accessCondition = or(isNull(categories.userId), eq(categories.userId, user.id));
    } else {
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

  async delete(user: { id: string; role?: string | null }, id: string) {
    // Determine which categories the user is allowed to delete
    let accessCondition;
    if (user.role === "superadmin") {
      // Superadmin can delete system defaults (userId = null) AND their own categories (userId = user.id)
      accessCondition = or(isNull(categories.userId), eq(categories.userId, user.id));
    } else {
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

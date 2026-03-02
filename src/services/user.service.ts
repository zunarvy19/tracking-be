import { db } from "../db/index.js";
import { user, userPreferences } from "../db/schema.js";
import { eq } from "drizzle-orm";

export interface UpdateProfileDTO {
  displayName?: string;
  defaultCurrency?: string;
  name?: string;
}

export const userService = {
  async getProfile(userId: string) {
    const result = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
        preferences: {
          displayName: userPreferences.displayName,
          defaultCurrency: userPreferences.defaultCurrency,
        },
      })
      .from(user)
      .leftJoin(userPreferences, eq(user.id, userPreferences.userId))
      .where(eq(user.id, userId))
      .limit(1);

    return result[0] || null;
  },

  async updateProfile(userId: string, data: UpdateProfileDTO) {
    // Update auth user name if provided
    if (data.name) {
      await db
        .update(user)
        .set({ name: data.name, updatedAt: new Date() })
        .where(eq(user.id, userId));
    }

    // Upsert preferences
    const existing = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(userPreferences).values({
        userId,
        displayName: data.displayName,
        defaultCurrency: data.defaultCurrency || "IDR",
      });
    } else {
      const updateData: Record<string, unknown> = { updatedAt: new Date() };
      if (data.displayName !== undefined)
        updateData.displayName = data.displayName;
      if (data.defaultCurrency !== undefined)
        updateData.defaultCurrency = data.defaultCurrency;

      await db
        .update(userPreferences)
        .set(updateData)
        .where(eq(userPreferences.userId, userId));
    }

    return this.getProfile(userId);
  },

  async deleteAccount(userId: string) {
    // Cascade will handle related records
    const result = await db
      .delete(user)
      .where(eq(user.id, userId))
      .returning();

    return result[0] || null;
  },
};

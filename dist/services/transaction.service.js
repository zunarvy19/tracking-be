import { db } from "../db/index.js";
import { transactions, categories } from "../db/schema.js";
import { eq, and, desc, gte, lte, count } from "drizzle-orm";
export const transactionService = {
    async list(userId, filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;
        const conditions = [eq(transactions.userId, userId)];
        if (filters.category) {
            conditions.push(eq(transactions.categoryId, filters.category));
        }
        if (filters.status) {
            conditions.push(eq(transactions.status, filters.status));
        }
        if (filters.type) {
            conditions.push(eq(transactions.type, filters.type));
        }
        if (filters.startDate) {
            conditions.push(gte(transactions.date, filters.startDate));
        }
        if (filters.endDate) {
            conditions.push(lte(transactions.date, filters.endDate));
        }
        const whereClause = and(...conditions);
        const [data, totalResult] = await Promise.all([
            db
                .select({
                id: transactions.id,
                type: transactions.type,
                amount: transactions.amount,
                description: transactions.description,
                notes: transactions.notes,
                date: transactions.date,
                status: transactions.status,
                paymentMethod: transactions.paymentMethod,
                createdAt: transactions.createdAt,
                category: {
                    id: categories.id,
                    name: categories.name,
                    icon: categories.icon,
                    color: categories.color,
                },
            })
                .from(transactions)
                .leftJoin(categories, eq(transactions.categoryId, categories.id))
                .where(whereClause)
                .orderBy(desc(transactions.date), desc(transactions.createdAt))
                .limit(limit)
                .offset(offset),
            db
                .select({ total: count() })
                .from(transactions)
                .where(whereClause),
        ]);
        const total = totalResult[0]?.total || 0;
        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },
    async getById(userId, id) {
        const result = await db
            .select({
            id: transactions.id,
            type: transactions.type,
            amount: transactions.amount,
            description: transactions.description,
            notes: transactions.notes,
            date: transactions.date,
            status: transactions.status,
            paymentMethod: transactions.paymentMethod,
            createdAt: transactions.createdAt,
            updatedAt: transactions.updatedAt,
            category: {
                id: categories.id,
                name: categories.name,
                icon: categories.icon,
                color: categories.color,
            },
        })
            .from(transactions)
            .leftJoin(categories, eq(transactions.categoryId, categories.id))
            .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
            .limit(1);
        return result[0] || null;
    },
    async create(userId, data) {
        const result = await db
            .insert(transactions)
            .values({
            userId,
            categoryId: data.categoryId,
            type: data.type,
            amount: data.amount,
            description: data.description,
            notes: data.notes,
            date: data.date,
            status: data.status || "completed",
            paymentMethod: data.paymentMethod,
        })
            .returning();
        return result[0];
    },
    async update(userId, id, data) {
        const result = await db
            .update(transactions)
            .set({
            ...data,
            updatedAt: new Date(),
        })
            .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
            .returning();
        return result[0] || null;
    },
    async delete(userId, id) {
        const result = await db
            .delete(transactions)
            .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
            .returning();
        return result[0] || null;
    },
    async exportCsv(userId, filters) {
        const { data } = await this.list(userId, { ...filters, limit: 10000, page: 1 });
        const headers = "Date,Description,Category,Type,Amount,Status,Payment Method,Notes\n";
        const rows = data
            .map((t) => `${t.date},"${t.description}","${t.category?.name || ""}",${t.type},${t.amount},${t.status},"${t.paymentMethod || ""}","${t.notes || ""}"`)
            .join("\n");
        return headers + rows;
    },
};

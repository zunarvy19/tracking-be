import { db } from "../db/index.js";
import { budgets, categories, transactions } from "../db/schema.js";
import { eq, and, sql, gte, lte } from "drizzle-orm";
function getCurrentPeriodRange(period) {
    const now = new Date();
    let start;
    let end;
    if (period === "monthly") {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }
    else {
        const day = now.getDay();
        start = new Date(now);
        start.setDate(now.getDate() - day);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
    }
    return {
        start: start.toISOString().split("T")[0],
        end: end.toISOString().split("T")[0],
    };
}
export const budgetService = {
    async list(userId) {
        const budgetList = await db
            .select({
            id: budgets.id,
            amount: budgets.amount,
            period: budgets.period,
            createdAt: budgets.createdAt,
            category: {
                id: categories.id,
                name: categories.name,
                icon: categories.icon,
                color: categories.color,
                description: categories.description,
            },
        })
            .from(budgets)
            .leftJoin(categories, eq(budgets.categoryId, categories.id))
            .where(eq(budgets.userId, userId));
        // Calculate spent amount for each budget in current period
        const result = await Promise.all(budgetList.map(async (budget) => {
            const { start, end } = getCurrentPeriodRange(budget.period);
            const spentResult = await db
                .select({
                total: sql `COALESCE(SUM(${transactions.amount}), 0)`,
            })
                .from(transactions)
                .where(and(eq(transactions.userId, userId), eq(transactions.categoryId, budget.category.id), eq(transactions.type, "expense"), gte(transactions.date, start), lte(transactions.date, end)));
            const spent = spentResult[0]?.total || "0";
            const budgetAmount = parseFloat(budget.amount);
            const spentAmount = parseFloat(spent);
            const remaining = budgetAmount - spentAmount;
            const percentage = budgetAmount > 0 ? Math.round((spentAmount / budgetAmount) * 100) : 0;
            let statusLabel = "Good";
            if (percentage >= 100)
                statusLabel = "Alert";
            else if (percentage >= 90)
                statusLabel = "Limit Reached";
            else if (percentage >= 75)
                statusLabel = "Warning";
            else if (percentage >= 50)
                statusLabel = "On Track";
            return {
                ...budget,
                spent,
                remaining: remaining.toFixed(2),
                percentage,
                statusLabel,
            };
        }));
        return result;
    },
    async getSummary(userId) {
        const budgetList = await this.list(userId);
        const totalBudgeted = budgetList.reduce((sum, b) => sum + parseFloat(b.amount), 0);
        const totalSpent = budgetList.reduce((sum, b) => sum + parseFloat(b.spent), 0);
        const remaining = totalBudgeted - totalSpent;
        const percentageUsed = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;
        return {
            totalBudgeted: totalBudgeted.toFixed(2),
            totalSpent: totalSpent.toFixed(2),
            remaining: remaining.toFixed(2),
            percentageUsed,
        };
    },
    async create(userId, data) {
        const result = await db
            .insert(budgets)
            .values({
            userId,
            categoryId: data.categoryId,
            amount: data.amount,
            period: data.period || "monthly",
        })
            .returning();
        return result[0];
    },
    async update(userId, id, data) {
        const result = await db
            .update(budgets)
            .set({
            ...data,
            updatedAt: new Date(),
        })
            .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
            .returning();
        return result[0] || null;
    },
    async delete(userId, id) {
        const result = await db
            .delete(budgets)
            .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
            .returning();
        return result[0] || null;
    },
};

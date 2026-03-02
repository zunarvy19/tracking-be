import { db } from "../db/index.js";
import { transactions, categories } from "../db/schema.js";
import { eq, and, sql, desc, gte, lte } from "drizzle-orm";

export const dashboardService = {
  async getStats(userId: string) {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      .toISOString()
      .split("T")[0];
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
      .toISOString()
      .split("T")[0];

    // Current month totals
    const currentMonth = await db
      .select({
        type: transactions.type,
        total: sql<string>`COALESCE(SUM(${transactions.amount}), 0)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.date, currentMonthStart),
          lte(transactions.date, currentMonthEnd)
        )
      )
      .groupBy(transactions.type);

    // Last month totals
    const lastMonth = await db
      .select({
        type: transactions.type,
        total: sql<string>`COALESCE(SUM(${transactions.amount}), 0)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.date, lastMonthStart),
          lte(transactions.date, lastMonthEnd)
        )
      )
      .groupBy(transactions.type);

    // All-time total balance
    const balanceResult = await db
      .select({
        type: transactions.type,
        total: sql<string>`COALESCE(SUM(${transactions.amount}), 0)`,
      })
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .groupBy(transactions.type);

    const extract = (rows: { type: string; total: string }[]) => ({
      income: parseFloat(rows.find((r) => r.type === "income")?.total || "0"),
      expense: parseFloat(rows.find((r) => r.type === "expense")?.total || "0"),
    });

    const current = extract(currentMonth);
    const last = extract(lastMonth);
    const allTime = extract(balanceResult);

    const balance = allTime.income - allTime.expense;

    const calcTrend = (cur: number, prev: number) => {
      if (prev === 0) return cur > 0 ? 100 : 0;
      return Math.round(((cur - prev) / prev) * 100);
    };

    return {
      balance: balance.toFixed(2),
      income: current.income.toFixed(2),
      expense: current.expense.toFixed(2),
      incomeTrend: calcTrend(current.income, last.income),
      expenseTrend: calcTrend(current.expense, last.expense),
      balanceTrend: calcTrend(
        balance,
        allTime.income - last.income - (allTime.expense - last.expense)
      ),
    };
  },

  async getRecentTransactions(userId: string, limit = 5) {
    const result = await db
      .select({
        id: transactions.id,
        type: transactions.type,
        amount: transactions.amount,
        description: transactions.description,
        date: transactions.date,
        status: transactions.status,
        paymentMethod: transactions.paymentMethod,
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
          color: categories.color,
        },
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date), desc(transactions.createdAt))
      .limit(limit);

    return result;
  },
};

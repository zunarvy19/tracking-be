import { db } from "../db/index.js";
import { transactions, categories } from "../db/schema.js";
import { eq, and, sql, desc, gte, lte } from "drizzle-orm";

function getPeriodRange(period: string) {
  const now = new Date();
  let start: Date;
  let end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  switch (period) {
    case "last_month":
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    case "3_months":
      start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      break;
    case "this_month":
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
  }

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

export const reportService = {
  async getSummary(userId: string, period = "this_month") {
    const { start, end } = getPeriodRange(period);

    const result = await db
      .select({
        type: transactions.type,
        total: sql<string>`COALESCE(SUM(${transactions.amount}), 0)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.date, start),
          lte(transactions.date, end)
        )
      )
      .groupBy(transactions.type);

    const income = parseFloat(
      result.find((r) => r.type === "income")?.total || "0"
    );
    const expense = parseFloat(
      result.find((r) => r.type === "expense")?.total || "0"
    );

    // Previous period for trend
    const prevStart = new Date(start);
    const prevEnd = new Date(end);
    const diff = prevEnd.getTime() - prevStart.getTime();
    prevStart.setTime(prevStart.getTime() - diff);
    prevEnd.setTime(prevEnd.getTime() - diff);

    const prevResult = await db
      .select({
        type: transactions.type,
        total: sql<string>`COALESCE(SUM(${transactions.amount}), 0)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.date, prevStart.toISOString().split("T")[0]),
          lte(transactions.date, prevEnd.toISOString().split("T")[0])
        )
      )
      .groupBy(transactions.type);

    const prevIncome = parseFloat(
      prevResult.find((r) => r.type === "income")?.total || "0"
    );
    const prevExpense = parseFloat(
      prevResult.find((r) => r.type === "expense")?.total || "0"
    );

    const calcTrend = (cur: number, prev: number) => {
      if (prev === 0) return cur > 0 ? 100 : 0;
      return Math.round(((cur - prev) / prev) * 100);
    };

    return {
      income: income.toFixed(2),
      expense: expense.toFixed(2),
      savings: (income - expense).toFixed(2),
      incomeTrend: calcTrend(income, prevIncome),
      expenseTrend: calcTrend(expense, prevExpense),
      savingsTrend: calcTrend(
        income - expense,
        prevIncome - prevExpense
      ),
    };
  },

  async getExpenseBreakdown(userId: string, period = "this_month") {
    const { start, end } = getPeriodRange(period);

    const result = await db
      .select({
        categoryName: categories.name,
        categoryIcon: categories.icon,
        categoryColor: categories.color,
        total: sql<string>`COALESCE(SUM(${transactions.amount}), 0)`,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, "expense"),
          gte(transactions.date, start),
          lte(transactions.date, end)
        )
      )
      .groupBy(categories.name, categories.icon, categories.color);

    const totalExpense = result.reduce(
      (sum, r) => sum + parseFloat(r.total),
      0
    );

    return result.map((r) => ({
      category: r.categoryName,
      icon: r.categoryIcon,
      color: r.categoryColor,
      amount: r.total,
      percentage:
        totalExpense > 0
          ? Math.round((parseFloat(r.total) / totalExpense) * 100)
          : 0,
    }));
  },

  async getMonthlyComparison(userId: string, months = 5) {
    const now = new Date();
    const result = [];

    for (let i = months - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthName = monthStart.toLocaleString("en-US", { month: "short" });

      const totals = await db
        .select({
          type: transactions.type,
          total: sql<string>`COALESCE(SUM(${transactions.amount}), 0)`,
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            gte(transactions.date, monthStart.toISOString().split("T")[0]),
            lte(transactions.date, monthEnd.toISOString().split("T")[0])
          )
        )
        .groupBy(transactions.type);

      result.push({
        month: monthName,
        income: totals.find((t) => t.type === "income")?.total || "0",
        expense: totals.find((t) => t.type === "expense")?.total || "0",
      });
    }

    return result;
  },

  async getLargeTransactions(userId: string, period = "this_month", limit = 5) {
    const { start, end } = getPeriodRange(period);

    const result = await db
      .select({
        id: transactions.id,
        type: transactions.type,
        amount: transactions.amount,
        description: transactions.description,
        date: transactions.date,
        category: {
          name: categories.name,
          icon: categories.icon,
          color: categories.color,
        },
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.date, start),
          lte(transactions.date, end)
        )
      )
      .orderBy(desc(sql`CAST(${transactions.amount} AS NUMERIC)`))
      .limit(limit);

    return result;
  },
};

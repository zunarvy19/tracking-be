export declare const reportService: {
    getSummary(userId: string, period?: string): Promise<{
        income: string;
        expense: string;
        savings: string;
        incomeTrend: number;
        expenseTrend: number;
        savingsTrend: number;
    }>;
    getExpenseBreakdown(userId: string, period?: string): Promise<{
        category: string | null;
        icon: string | null;
        color: string | null;
        amount: string;
        percentage: number;
    }[]>;
    getMonthlyComparison(userId: string, months?: number): Promise<{
        month: string;
        income: string;
        expense: string;
    }[]>;
    getLargeTransactions(userId: string, period?: string, limit?: number): Promise<{
        id: string;
        type: "income" | "expense";
        amount: string;
        description: string;
        date: string;
        category: {
            name: string;
            icon: string;
            color: string | null;
        } | null;
    }[]>;
};

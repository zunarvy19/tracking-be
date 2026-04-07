export declare const dashboardService: {
    getStats(userId: string): Promise<{
        balance: string;
        income: string;
        expense: string;
        saving: string;
        incomeTrend: number;
        expenseTrend: number;
        savingTrend: number;
        balanceTrend: number;
    }>;
    getRecentTransactions(userId: string, limit?: number): Promise<{
        id: string;
        type: "income" | "expense";
        amount: string;
        description: string;
        date: string;
        status: "completed" | "pending" | "syncing";
        paymentMethod: string | null;
        category: {
            id: string;
            name: string;
            icon: string;
            color: string | null;
        } | null;
    }[]>;
};

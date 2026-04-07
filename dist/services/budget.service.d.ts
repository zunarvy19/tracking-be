export interface CreateBudgetDTO {
    categoryId: string;
    amount: string;
    period?: "weekly" | "monthly";
}
export declare const budgetService: {
    list(userId: string): Promise<{
        spent: string;
        remaining: string;
        percentage: number;
        statusLabel: string;
        id: string;
        amount: string;
        period: "weekly" | "monthly";
        createdAt: Date;
        category: {
            id: string;
            name: string;
            icon: string;
            color: string | null;
            description: string | null;
        } | null;
    }[]>;
    getSummary(userId: string): Promise<{
        totalBudgeted: string;
        totalSpent: string;
        remaining: string;
        percentageUsed: number;
    }>;
    create(userId: string, data: CreateBudgetDTO): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        categoryId: string;
        amount: string;
        period: "weekly" | "monthly";
    }>;
    update(userId: string, id: string, data: Partial<CreateBudgetDTO>): Promise<{
        id: string;
        userId: string;
        categoryId: string;
        amount: string;
        period: "weekly" | "monthly";
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        categoryId: string;
        amount: string;
        period: "weekly" | "monthly";
    }>;
};

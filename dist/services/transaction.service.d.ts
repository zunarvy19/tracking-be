export interface TransactionFilters {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    type?: string;
}
export interface CreateTransactionDTO {
    categoryId: string;
    type: "income" | "expense";
    amount: string;
    description: string;
    notes?: string;
    date: string;
    status?: "completed" | "pending" | "syncing";
    paymentMethod?: string;
}
export declare const transactionService: {
    list(userId: string, filters: TransactionFilters): Promise<{
        data: {
            id: string;
            type: "income" | "expense";
            amount: string;
            description: string;
            notes: string | null;
            date: string;
            status: "completed" | "pending" | "syncing";
            paymentMethod: string | null;
            createdAt: Date;
            category: {
                id: string;
                name: string;
                icon: string;
                color: string | null;
            } | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getById(userId: string, id: string): Promise<{
        id: string;
        type: "income" | "expense";
        amount: string;
        description: string;
        notes: string | null;
        date: string;
        status: "completed" | "pending" | "syncing";
        paymentMethod: string | null;
        createdAt: Date;
        updatedAt: Date;
        category: {
            id: string;
            name: string;
            icon: string;
            color: string | null;
        } | null;
    }>;
    create(userId: string, data: CreateTransactionDTO): Promise<{
        date: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description: string;
        type: "income" | "expense";
        categoryId: string;
        amount: string;
        notes: string | null;
        status: "completed" | "pending" | "syncing";
        paymentMethod: string | null;
    }>;
    update(userId: string, id: string, data: Partial<CreateTransactionDTO>): Promise<{
        id: string;
        userId: string;
        categoryId: string;
        type: "income" | "expense";
        amount: string;
        description: string;
        notes: string | null;
        date: string;
        status: "completed" | "pending" | "syncing";
        paymentMethod: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(userId: string, id: string): Promise<{
        date: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description: string;
        type: "income" | "expense";
        categoryId: string;
        amount: string;
        notes: string | null;
        status: "completed" | "pending" | "syncing";
        paymentMethod: string | null;
    }>;
    exportCsv(userId: string, filters: TransactionFilters): Promise<string>;
};

export interface CreateCategoryDTO {
    name: string;
    icon: string;
    description?: string;
    color?: string;
    type?: "income" | "expense" | "both";
}
export declare const categoryService: {
    list(user: {
        id: string;
        role?: string | null;
    }): Promise<{
        id: string;
        userId: string | null;
        name: string;
        icon: string;
        description: string | null;
        color: string | null;
        type: "income" | "expense" | "both";
        isDefault: boolean;
        createdAt: Date;
    }[]>;
    create(user: {
        id: string;
        role?: string | null;
    }, data: CreateCategoryDTO): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        userId: string | null;
        icon: string;
        description: string | null;
        color: string | null;
        type: "income" | "expense" | "both";
        isDefault: boolean;
    }>;
    update(user: {
        id: string;
        role?: string | null;
    }, id: string, data: Partial<CreateCategoryDTO>): Promise<{
        id: string;
        userId: string | null;
        name: string;
        icon: string;
        description: string | null;
        color: string | null;
        type: "income" | "expense" | "both";
        isDefault: boolean;
        createdAt: Date;
    }>;
    delete(user: {
        id: string;
        role?: string | null;
    }, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        userId: string | null;
        icon: string;
        description: string | null;
        color: string | null;
        type: "income" | "expense" | "both";
        isDefault: boolean;
    }>;
};

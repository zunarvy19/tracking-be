export interface UpdateProfileDTO {
    displayName?: string;
    defaultCurrency?: string;
    name?: string;
}
export declare const userService: {
    getProfile(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        image: string | null;
        createdAt: Date;
        preferences: {
            displayName: string | null;
            defaultCurrency: string;
        } | null;
    }>;
    updateProfile(userId: string, data: UpdateProfileDTO): Promise<{
        id: string;
        name: string;
        email: string;
        image: string | null;
        createdAt: Date;
        preferences: {
            displayName: string | null;
            defaultCurrency: string;
        } | null;
    }>;
    deleteAccount(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: string | null;
        banned: boolean | null;
        banReason: string | null;
        banExpires: Date | null;
    }>;
};

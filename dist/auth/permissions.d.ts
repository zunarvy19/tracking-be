export declare const statement: {
    readonly category: readonly ["create", "update", "delete", "manage_default"];
    readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "get", "update"];
    readonly session: readonly ["list", "revoke", "delete"];
};
export declare const ac: {
    newRole<K extends "user" | "session" | "category">(statements: import("better-auth/plugins").Subset<K, {
        readonly category: readonly ["create", "update", "delete", "manage_default"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>): {
        authorize<K_1 extends K>(request: K_1 extends infer T extends K_2 ? { [key in T]?: import("better-auth/plugins").Subset<K, {
            readonly category: readonly ["create", "update", "delete", "manage_default"];
            readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "get", "update"];
            readonly session: readonly ["list", "revoke", "delete"];
        }>[key] | {
            actions: import("better-auth/plugins").Subset<K, {
                readonly category: readonly ["create", "update", "delete", "manage_default"];
                readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "get", "update"];
                readonly session: readonly ["list", "revoke", "delete"];
            }>[key];
            connector: "OR" | "AND";
        } | undefined; } : never, connector?: "OR" | "AND"): import("better-auth/plugins").AuthorizeResponse;
        statements: import("better-auth/plugins").Subset<K, {
            readonly category: readonly ["create", "update", "delete", "manage_default"];
            readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "get", "update"];
            readonly session: readonly ["list", "revoke", "delete"];
        }>;
    };
    statements: {
        readonly category: readonly ["create", "update", "delete", "manage_default"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    };
};
export declare const admin: {
    authorize<K_1 extends "user" | "session" | "category">(request: K_1 extends infer T extends K ? { [key in T]?: import("better-auth/plugins").Subset<"user" | "session" | "category", {
        readonly category: readonly ["create", "update", "delete", "manage_default"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>[key] | {
        actions: import("better-auth/plugins").Subset<"user" | "session" | "category", {
            readonly category: readonly ["create", "update", "delete", "manage_default"];
            readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "get", "update"];
            readonly session: readonly ["list", "revoke", "delete"];
        }>[key];
        connector: "OR" | "AND";
    } | undefined; } : never, connector?: "OR" | "AND"): import("better-auth/plugins").AuthorizeResponse;
    statements: import("better-auth/plugins").Subset<"user" | "session" | "category", {
        readonly category: readonly ["create", "update", "delete", "manage_default"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>;
};
export declare const superadmin: {
    authorize<K_1 extends "user" | "session" | "category">(request: K_1 extends infer T extends K ? { [key in T]?: import("better-auth/plugins").Subset<"user" | "session" | "category", {
        readonly category: readonly ["create", "update", "delete", "manage_default"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>[key] | {
        actions: import("better-auth/plugins").Subset<"user" | "session" | "category", {
            readonly category: readonly ["create", "update", "delete", "manage_default"];
            readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "get", "update"];
            readonly session: readonly ["list", "revoke", "delete"];
        }>[key];
        connector: "OR" | "AND";
    } | undefined; } : never, connector?: "OR" | "AND"): import("better-auth/plugins").AuthorizeResponse;
    statements: import("better-auth/plugins").Subset<"user" | "session" | "category", {
        readonly category: readonly ["create", "update", "delete", "manage_default"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>;
};
export declare const user: {
    authorize<K_1 extends "category">(request: K_1 extends infer T extends K ? { [key in T]?: import("better-auth/plugins").Subset<"category", {
        readonly category: readonly ["create", "update", "delete", "manage_default"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>[key] | {
        actions: import("better-auth/plugins").Subset<"category", {
            readonly category: readonly ["create", "update", "delete", "manage_default"];
            readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "get", "update"];
            readonly session: readonly ["list", "revoke", "delete"];
        }>[key];
        connector: "OR" | "AND";
    } | undefined; } : never, connector?: "OR" | "AND"): import("better-auth/plugins").AuthorizeResponse;
    statements: import("better-auth/plugins").Subset<"category", {
        readonly category: readonly ["create", "update", "delete", "manage_default"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>;
};

import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

// Define the permissions available for roles. We extend the default admin
// statements and add our own resource for 'category'.
export const statement = {
  ...defaultStatements,
  category: ["create", "update", "delete", "manage_default"],
} as const;

export const ac = createAccessControl(statement);

// The predefined 'admin' role, extending the built-in default admin
export const admin = ac.newRole({
  category: ["create", "update", "delete"], // Admins can manage regular categories
  ...adminAc.statements,
});

// The custom 'superadmin' role, which has full access including 'manage_default'
export const superadmin = ac.newRole({
  category: ["create", "update", "delete", "manage_default"],
  ...adminAc.statements,
});

// The default 'user' role
export const user = ac.newRole({
  category: ["create", "update", "delete"], // Users can manage their own categories
});

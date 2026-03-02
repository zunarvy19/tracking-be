import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "../db/index.js";
import * as schema from "../db/schema.js";
import { ac, admin as adminRole, user, superadmin } from "./permissions.js";
import "dotenv/config";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      ac,
      roles: {
        admin: adminRole,
        user,
        superadmin,
      },
      defaultRole: "user",
      adminRoles: ["admin", "superadmin"],
    }),
  ],
  trustedOrigins: [process.env.CORS_ORIGIN || "http://localhost:5173"],
});

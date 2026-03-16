import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/admin/access";

import { UserRoleEnumSchema } from "@workspace/drizzle/client-enums";

const statement = {
  ...defaultStatements,
} as const;

const ac = createAccessControl(statement);

export const accessControl = {
  ac,
  roles: {
    [UserRoleEnumSchema.enum.SUPER_ADMIN]: ac.newRole({
      user: [
        "ban",
        "get",
        "update",
        "delete",
        "set-role",
        "impersonate",
        "impersonate-admins",
        "list",
      ],
    }),
  },
};

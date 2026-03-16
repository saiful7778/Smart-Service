import { ColumnDef } from "@tanstack/react-table";
import UserTableRowAction from "./UserTableRowAction";
import UserBannedCell from "./cells/UserBannedCell";
import { UserAvatar } from "@/components/UserAvatar";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ListUserOutput } from "../../api/user.router";
import { Badge } from "@workspace/ui/components/badge";
import { formatEnumValue } from "@workspace/lib";
import {
  type UserRoleEnumType,
  UserRoleEnumSchema,
} from "@workspace/drizzle/client-enums";
import { UserTableRowContextProvider } from "../../context/UserTableRowContext";
import { format } from "date-fns";

export const teamsTableColumn: Array<
  ColumnDef<ListUserOutput["data"]["data"][number]>
> = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Full name" />
    ),
    cell: ({ row, getValue }) => (
      <UserAvatar
        userEmail={row.original?.email}
        imageUrl={row.original?.image}
        userName={getValue<string>()}
        showDetails
      />
    ),
    meta: { label: "Full name" },
    enableHiding: false,
  },
  {
    id: "displayRole",
    accessorKey: "displayRole",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Display Role" />
    ),
    cell: ({ getValue }) => {
      const displayRole = getValue<string | null>();

      return displayRole ? (
        <Badge variant="secondary">{displayRole}</Badge>
      ) : null;
    },
    enableSorting: false,
    meta: { label: "Display Role" },
  },
  {
    id: "role",
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Role" />
    ),
    cell: ({ getValue }) => (
      <Badge variant="secondary">
        {formatEnumValue(getValue<UserRoleEnumType>())}
      </Badge>
    ),
    meta: {
      label: "Role",
      variant: "select",
      options: UserRoleEnumSchema.options.map((enumValue) => ({
        label: formatEnumValue(enumValue),
        value: enumValue,
      })),
    },
    enableColumnFilter: true,
    enableSorting: false,
  },
  {
    id: "banned",
    accessorKey: "banned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Banned" />
    ),
    cell: ({ getValue, row }) => (
      <UserBannedCell
        banned={getValue<boolean>()}
        banReason={row.original.banReason}
        banExpires={row.original.banExpires}
      />
    ),
    meta: { label: "Banned" },
    enableSorting: false,
  },
  {
    accessorKey: "emailVerified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Email Verified" />
    ),
    cell: ({ getValue }) => (
      <div>
        <Badge variant="secondary">
          {getValue<boolean>() ? "TRUE" : "FALSE"}
        </Badge>
      </div>
    ),
    meta: { label: "Email Verified" },
    enableSorting: false,
  },
  {
    accessorKey: "lastLogin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Last Login" />
    ),
    cell: ({ getValue }) => {
      const lastLogin = getValue<Date | null>();
      return lastLogin ? (
        <Badge variant="secondary">
          {format(new Date(lastLogin), "dd MMM, yyyy HH:mm aa")}
        </Badge>
      ) : null;
    },
    enableSorting: false,
    meta: { label: "Last Login" },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <UserTableRowContextProvider userData={row.original}>
        <UserTableRowAction />
      </UserTableRowContextProvider>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 32,
  },
];

"use client";

import { createContext, useContext, useState } from "react";

import { ListUserOutput } from "../api/user.router";

interface UserTableRowContextProps {
  openDeleteDialog: boolean;
  setOpenDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openUpdateDialog: boolean;
  setOpenUpdateDialog: React.Dispatch<React.SetStateAction<boolean>>;
  userData: ListUserOutput["data"]["data"][number];
}

const UserTableRowContext = createContext<UserTableRowContextProps | null>(
  null
);

function UserTableRowContextProvider({
  children,
  userData,
}: {
  userData: ListUserOutput["data"]["data"][number];
  children: React.ReactNode;
}) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);

  return (
    <UserTableRowContext.Provider
      value={{
        openDeleteDialog,
        setOpenDeleteDialog,
        openUpdateDialog,
        setOpenUpdateDialog,
        userData,
      }}
    >
      {children}
    </UserTableRowContext.Provider>
  );
}

function useUserTableRowContext() {
  const context = useContext(UserTableRowContext);
  if (!context) {
    throw new Error("'UserTableRowContextProvider' not provided");
  }
  return context;
}

export { UserTableRowContextProvider, useUserTableRowContext };

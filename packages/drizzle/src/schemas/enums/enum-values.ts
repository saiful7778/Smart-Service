export const USER_ROLES = ["USER", "ADMIN", "SUPER_ADMIN"] as const;

export const USER_EVENT_CATEGORY = [
  "AUTH", // login, logout, password change
  "PROFILE", // updated name, avatar
  "ORG", // joined org, left org, invited member
  "ADMIN", // role changed, banned, unbanned — actor is an admin
  "CONTENT", // whatever your app's core actions are
] as const;

import { type User } from "firebase/auth";
import { createContext } from "react";

export type Anonymous = { state: "anonymous" };
export type Authenticated = {
  state: "authenticated";
  user: User;
  signOut: () => Promise<void>;
};

export type AuthContextType = Anonymous | Authenticated;

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

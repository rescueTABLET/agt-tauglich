import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { ReactNode, useEffect, useState } from "react";
import GlobalLoading from "../../components/GlobalLoading";
import { auth } from "../../firebase";
import { AuthContext, type AuthContextType } from "./auth-context";

export interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [context, setContext] = useState<AuthContextType>();

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) =>
        setContext(
          user
            ? {
                state: "authenticated",
                user,
                signOut: async () => {
                  await firebaseSignOut(auth);
                },
              }
            : { state: "anonymous" }
        )
      ),
    []
  );

  return context ? (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  ) : (
    <GlobalLoading />
  );
}
import {
  User,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import GlobalLoading from "../components/GlobalLoading";
import { auth } from "../firebase";

export type Anonymous = { state: "anonymous" };
export type Authenticated = {
  state: "authenticated";
  user: User;
  signOut: () => Promise<void>;
};

export type AuthContextType = Anonymous | Authenticated;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthenticated(): Authenticated {
  const context = useAuth();
  if (context.state !== "authenticated") throw new Error("Unauthenticated");
  return context;
}

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

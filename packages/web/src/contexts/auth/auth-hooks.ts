import { useContext } from "react";
import { AuthContext, type AuthContextType, type Authenticated } from "./auth-context";

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
import Pages from "./Pages";
import { AuthProvider } from "./contexts/AuthContext";
import ThemeProvider from "./theme";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Pages />
      </AuthProvider>
    </ThemeProvider>
  );
}

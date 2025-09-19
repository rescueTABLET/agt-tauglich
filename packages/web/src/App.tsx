import Pages from "./Pages";
import { AuthProvider } from "./contexts/auth";
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

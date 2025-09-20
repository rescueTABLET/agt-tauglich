import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { signInWithEmail } from "../../services/auth";

interface SignInFormProps {
  onToggleMode: () => void;
}

export default function SignInForm({ onToggleMode }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      setError(err.message || "Ups, die Anmeldung hat nicht geklappt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Anmelden
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2}>
        <TextField
          label="E-Mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Passwort"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          fullWidth
          size="large"
        >
          {loading ? "Wird angemeldet..." : "Anmelden"}
        </Button>
        <Button
          variant="text"
          onClick={onToggleMode}
          disabled={loading}
        >
          Noch kein Konto? Registrieren
        </Button>
      </Stack>
    </Box>
  );
}
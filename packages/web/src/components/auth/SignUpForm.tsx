import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { signUpWithEmail } from "../../services/auth";

interface SignUpFormProps {
  onToggleMode: () => void;
}

export default function SignUpForm({ onToggleMode }: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    if (password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen haben");
      return;
    }

    setLoading(true);

    try {
      await signUpWithEmail(email, password);
    } catch (err: any) {
      setError(err.message || "Ups, das Konto konnte nicht erstellt werden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Registrieren
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
        <TextField
          label="Passwort bestätigen"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? "Konto wird erstellt..." : "Registrieren"}
        </Button>
        <Button variant="text" onClick={onToggleMode} disabled={loading}>
          Bereits ein Konto? Anmelden
        </Button>
      </Stack>
    </Box>
  );
}

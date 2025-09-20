import { Google } from "@mui/icons-material";
import { Alert, Button } from "@mui/material";
import { useState } from "react";
import { signInWithGoogle } from "../../services/auth";

export default function GoogleSignInButton() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Ups, die Google-Anmeldung hat nicht geklappt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Button
        variant="outlined"
        onClick={handleGoogleSignIn}
        disabled={loading}
        startIcon={<Google />}
        fullWidth
        size="large"
      >
        {loading ? "Wird angemeldet..." : "Mit Google fortfahren"}
      </Button>
    </>
  );
}

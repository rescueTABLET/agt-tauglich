import { ThumbUp } from "@mui/icons-material";
import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import SignInForm from "../components/auth/SignInForm";
import SignUpForm from "../components/auth/SignUpForm";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/auth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const auth = useAuth();

  return auth.state === "authenticated" ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <LandingPage />
  );
}

function LandingPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", minHeight: "100vh" }}>
      <Box
        sx={{
          py: { sm: 4 },
          px: { sm: 3 },
          maxWidth: (theme) => theme.breakpoints.values.sm,
          mx: "auto",
        }}
      >
        <Card sx={{ borderRadius: { xs: 0, sm: 2 } }}>
          <CardContent sx={{ textAlign: "center" }}>
            <ThumbUp sx={{ fontSize: "6rem", color: "primary.main", my: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Bist du tauglich?
            </Typography>
            <Typography>
              Mit dieser App hast du deine AGT-Tauglichkeit immer im Blick und
              erhältst rechtzeitig vor Ablauf eine Erinnerung.
            </Typography>
          </CardContent>
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <GoogleSignInButton />
              <Divider>
                <Typography variant="body2">oder</Typography>
              </Divider>
              {isSignUp ? (
                <SignUpForm onToggleMode={toggleMode} />
              ) : (
                <SignInForm onToggleMode={toggleMode} />
              )}
            </Box>
          </CardContent>
          <Divider sx={{ my: 2 }} />
          <Footer />
        </Card>
      </Box>
    </Box>
  );
}

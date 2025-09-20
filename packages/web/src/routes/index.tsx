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
    <Box sx={{ display: "flex", alignItems: "center" }}>
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
            <Typography variant="h4" component="h1" gutterBottom>
              Willkommen bei Tauglich!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Verwalte deine AGT-Tauglichkeit und erhalte rechtzeitig vor dem
              Ablauf Erinnerungen.
            </Typography>
          </CardContent>
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <GoogleSignInButton />
              <Divider>
                <Typography variant="body2" color="text.secondary">
                  oder
                </Typography>
              </Divider>
              {isSignUp ? (
                <SignUpForm onToggleMode={toggleMode} />
              ) : (
                <SignInForm onToggleMode={toggleMode} />
              )}
            </Box>
          </CardContent>
          <Divider />
          <Footer />
        </Card>
      </Box>
    </Box>
  );
}

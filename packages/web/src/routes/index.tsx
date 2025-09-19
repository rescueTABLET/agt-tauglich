import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import SignInForm from "../components/auth/SignInForm";
import SignUpForm from "../components/auth/SignUpForm";
import { useAuth } from "../contexts/AuthContext";

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
    <Box sx={{ display: "flex", alignItems: "center", pt: 4 }}>
      <Container maxWidth="sm">
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Willkommen bei AGT Tauglich!
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
        </Card>
      </Container>
    </Box>
  );
}

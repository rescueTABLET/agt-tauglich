import {
  AppBar,
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import SignOutButton from "../components/auth/SignOutButton";
import { useAuthenticated } from "../contexts/AuthContext";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuthenticated();

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div">
            AGT Tauglich
          </Typography>
          <Box sx={{ ml: "auto" }}>
            <SignOutButton />
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>
        <Card>
          <CardHeader
            avatar={user.photoURL ? <Avatar src={user.photoURL} /> : null}
            title={<>Willkommen, {user.displayName ?? user.email}!</>}
            subheader={user.email}
          />
          <CardContent>
            <Typography gutterBottom>
              Dashboard-Funktionen kommen bald…
            </Typography>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

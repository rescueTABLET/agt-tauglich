import { Logout } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useAuthenticated } from "../../contexts/auth";

export default function SignOutButton() {
  const { signOut } = useAuthenticated();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Button
      variant="text"
      color="inherit"
      size="small"
      startIcon={<Logout />}
      onClick={handleSignOut}
    >
      Abmelden
    </Button>
  );
}

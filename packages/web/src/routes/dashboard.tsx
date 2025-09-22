import { Add, ThumbDown, ThumbUp } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { addDays } from "date-fns";
import { useEffect, useState } from "react";
import SignOutButton from "../components/auth/SignOutButton";
import Footer from "../components/Footer";
import ItemForm from "../components/items/ItemForm";
import ItemListItem from "../components/items/ItemListItem";
import { useAuthenticated } from "../contexts/auth";
import {
  useAddItem,
  useDeleteItem,
  useUpdateItem,
  useUserData,
} from "../hooks/useUserData";
import { type Item, ItemData, UserData } from "../model";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuthenticated();
  const { userData, loading, error } = useUserData();
  const addItem = useAddItem(user.uid);
  const updateItem = useUpdateItem(user.uid);
  const deleteItem = useDeleteItem(user.uid);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | undefined>();
  const [actionLoading, setActionLoading] = useState(false);

  const handleAddItem = () => {
    setEditingItem(undefined);
    setFormOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleDeleteClick = (item: Item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleSaveItem = async (itemData: ItemData) => {
    setActionLoading(true);
    try {
      if (editingItem) {
        await updateItem(editingItem.id, itemData);
      } else {
        await addItem(itemData);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setActionLoading(true);
    try {
      await deleteItem(itemToDelete.id);
      setDeleteDialogOpen(false);
      setItemToDelete(undefined);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(undefined);
  };

  const items = userData?.items || [];

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          py: 2,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {userData && <Hero user={userData} handleAddItem={handleAddItem} />}
        {loading ? (
          <LinearProgress />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 2,
            }}
          >
            {[...items]
              .sort((a, b) => a.validUntil.localeCompare(b.validUntil))
              .map((item) => (
                <ItemListItem
                  key={item.id}
                  item={item}
                  onEdit={() => handleEditItem(item)}
                  onDelete={() => handleDeleteClick(item)}
                />
              ))}
          </Box>
        )}
        <Box sx={{ mt: 4 }}>
          <Footer />
        </Box>
      </Container>

      <ItemForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveItem}
        item={editingItem}
        title={
          editingItem
            ? "Tauglichkeit bearbeiten"
            : "Neue Tauglichkeit hinzufügen"
        }
      />

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Tauglichkeit löschen</DialogTitle>
        <DialogContent>
          <Typography>
            Möchtest du "{itemToDelete?.label}" wirklich löschen? Diese Aktion
            kann nicht rückgängig gemacht werden.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            color="inherit"
            onClick={handleCancelDelete}
            disabled={actionLoading}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? "Löscht..." : "Löschen"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function Hero({
  user,
  handleAddItem,
}: {
  user: UserData;
  handleAddItem: () => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="h5">Hallo {user.displayName}!</Typography>
      <Status user={user} />
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<Add />}
        onClick={handleAddItem}
      >
        Tauglichkeit hinzufügen
      </Button>
      <SignOutButton />
    </Box>
  );
}

function Status({ user }: { user: UserData }) {
  const items = user.items ?? [];
  const now = new Date().toISOString().substring(0, 10);
  const warningThreshold = addDays(new Date(), -30)
    .toISOString()
    .substring(0, 10);
  const anyExpired = items.some((item) => item.validUntil < now);
  const anyWarning = items.some(
    (item) => item.validUntil < warningThreshold && item.validUntil >= now
  );

  useEffect(() => {
    const statusColor = anyExpired
      ? "var(--mui-palette-error-main)"
      : anyWarning
        ? "var(--mui-palette-warning-main)"
        : "var(--mui-palette-success-main)";
    document.documentElement.style.setProperty("--status-color", statusColor);
  }, [anyExpired, anyWarning]);

  if (anyExpired) {
    return (
      <Alert
        severity="error"
        variant="filled"
        icon={<ThumbDown />}
        sx={{ fontSize: "1.5rem" }}
      >
        Deine Tauglichkeit ist abgelaufen!
      </Alert>
    );
  }

  if (anyWarning) {
    return (
      <Alert
        severity="warning"
        variant="filled"
        icon={<ThumbDown />}
        sx={{ fontSize: "1.5rem" }}
      >
        Deine Tauglichkeit läuft bald ab!
      </Alert>
    );
  }

  return (
    <Alert
      severity="success"
      variant="filled"
      icon={<ThumbUp />}
      sx={{ fontSize: "1.5rem" }}
    >
      Du bist tauglich!
    </Alert>
  );
}

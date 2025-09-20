import { Add } from "@mui/icons-material";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import { type Item, ItemData } from "../model";

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
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div">
            Tauglich?
          </Typography>
          <Box sx={{ ml: "auto" }}>
            <SignOutButton />
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container
        sx={{
          py: 2,
          "--toolbar-height": { xs: "48px", sm: "64px" },
          minHeight: "calc(100vh - var(--toolbar-height))",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        <Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            onClick={handleAddItem}
          >
            Hinzufügen
          </Button>
        </Box>
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
              gap: 1,
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
        <Box sx={{ mt: "auto" }}>
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

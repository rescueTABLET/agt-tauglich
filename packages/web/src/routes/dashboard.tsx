import { Item, ItemData } from "@agt-tauglich/model";
import { Add, Assignment } from "@mui/icons-material";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  List,
  Toolbar,
  Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import SignOutButton from "../components/auth/SignOutButton";
import ItemForm from "../components/items/ItemForm";
import ItemListItem from "../components/items/ItemListItem";
import { useAuthenticated } from "../contexts/AuthContext";
import {
  useAddItem,
  useDeleteItem,
  useUpdateItem,
  useUserData,
} from "../hooks/useUserData";

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
  const itemCount = items.length;
  const expiringSoonCount = items.filter((item) => {
    const validUntilDate = new Date(item.validUntil);
    const today = new Date();
    const timeDiff = validUntilDate.getTime() - today.getTime();
    const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  }).length;

  const expiredCount = items.filter((item) => {
    const validUntilDate = new Date(item.validUntil);
    const today = new Date();
    return validUntilDate < today;
  }).length;

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
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card>
          <CardHeader
            title="Meine Tauglichkeiten"
            avatar={
              user.photoURL ? <Avatar src={user.photoURL} /> : <Assignment />
            }
            action={
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddItem}
              >
                Hinzufügen
              </Button>
            }
          />
          {loading ? (
            <LinearProgress />
          ) : itemCount === 0 ? (
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Noch keine Tauglichkeiten hinzugefügt
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Fügen Sie Ihre erste Tauglichkeit hinzu, um den Überblick über
                Ablaufdaten zu behalten.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddItem}
                size="large"
              >
                Erste Tauglichkeit hinzufügen
              </Button>
            </CardContent>
          ) : (
            <>
              <CardContent>
                {expiredCount > 0 && (
                  <Typography color="error" variant="body2">
                    ⚠️ {expiredCount} abgelaufen
                  </Typography>
                )}

                {expiringSoonCount > 0 && (
                  <Typography color="warning.main" variant="body2">
                    ⏰ {expiringSoonCount} laufen in den nächsten 30 Tagen ab
                  </Typography>
                )}
              </CardContent>
              <List>
                {items
                  .toSorted((a, b) => b.validUntil - a.validUntil)
                  .map((item, index) => (
                    <ItemListItem
                      key={item.id}
                      item={item}
                      divider={index < items.length - 1}
                      onEdit={() => handleEditItem(item)}
                      onDelete={() => handleDeleteClick(item)}
                    />
                  ))}
              </List>
            </>
          )}
        </Card>
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
            Möchten Sie "{itemToDelete?.label}" wirklich löschen? Diese Aktion
            kann nicht rückgängig gemacht werden.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={actionLoading}>
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

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { type Item, type ItemData, type Reminder } from "../../model";
import ReminderConfig from "./ReminderConfig";

interface ItemFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (itemData: ItemData) => Promise<void>;
  item?: Item;
  title: string;
}

export default function ItemForm({
  open,
  onClose,
  onSave,
  item,
  title,
}: ItemFormProps) {
  const [label, setLabel] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [reminders, setReminders] = useState<ReadonlyArray<Reminder>>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset form when dialog opens/closes or item changes
  useEffect(() => {
    if (open) {
      setLabel(item?.label || "");
      setValidUntil(item?.validUntil || "");
      setReminders(item?.reminders || []);
      setError("");
    }
  }, [open, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!label.trim()) {
      setError("Bitte gib eine Bezeichnung ein");
      return;
    }

    if (!validUntil) {
      setError("Bitte wähle ein Gültig-bis-Datum");
      return;
    }

    setLoading(true);

    try {
      await onSave({
        label: label.trim(),
        validUntil,
        reminders: reminders.length > 0 ? reminders : undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Ups, da ist was schiefgelaufen");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Bezeichnung"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              fullWidth
              disabled={loading}
              placeholder="z.B. Erste Hilfe Kurs, Führerschein, ..."
            />

            <TextField
              label="Gültig bis"
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              required
              fullWidth
              disabled={loading}
              InputLabelProps={{
                shrink: true,
              }}
              helperText="Das letzte Datum, an dem das Element gültig ist"
            />

            <ReminderConfig
              reminders={reminders}
              onChange={setReminders}
              disabled={loading}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            variant="text"
            color="inherit"
            onClick={handleClose}
            disabled={loading}
          >
            Abbrechen
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={loading}
          >
            {loading ? "Speichert..." : "Speichern"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

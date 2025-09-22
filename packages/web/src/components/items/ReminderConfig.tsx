import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { type Advance, type Reminder, type ReminderData } from "../../model";

interface ReminderConfigProps {
  reminders: ReadonlyArray<Reminder>;
  onChange: (reminders: ReadonlyArray<Reminder>) => void;
  disabled?: boolean;
}

type AdvanceUnit = "days" | "weeks" | "months";

interface ReminderFormData {
  value: number;
  unit: AdvanceUnit;
}

function formDataToAdvance(formData: ReminderFormData): Advance {
  switch (formData.unit) {
    case "days":
      return { days: formData.value };
    case "weeks":
      return { weeks: formData.value };
    case "months":
      return { months: formData.value };
  }
}

function formatAdvance(advance: Advance): string {
  if ("days" in advance) {
    return `${advance.days} ${advance.days === 1 ? "Tag" : "Tage"}`;
  }
  if ("weeks" in advance) {
    return `${advance.weeks} ${advance.weeks === 1 ? "Woche" : "Wochen"}`;
  }
  return `${advance.months} ${advance.months === 1 ? "Monat" : "Monate"}`;
}

export default function ReminderConfig({
  reminders,
  onChange,
  disabled = false,
}: ReminderConfigProps) {
  const [newReminder, setNewReminder] = useState<ReminderFormData>({
    value: 7,
    unit: "days",
  });

  const handleAddReminder = () => {
    if (newReminder.value <= 0) return;

    const reminderData: ReminderData = {
      advance: formDataToAdvance(newReminder),
      channel: "email",
    };

    const reminder: Reminder = {
      id: crypto.randomUUID(),
      ...reminderData,
    };

    onChange([...reminders, reminder]);
    setNewReminder({ value: 7, unit: "days" });
  };

  const handleDeleteReminder = (reminderId: string) => {
    onChange(reminders.filter((r) => r.id !== reminderId));
  };

  const canAddReminder = newReminder.value > 0 && !disabled;

  return (
    <Stack spacing={2}>
      <Typography variant="h6" component="h3">
        Erinnerungen
      </Typography>

      {reminders.length > 0 && (
        <Stack spacing={1}>
          {reminders.map((reminder) => (
            <Card key={reminder.id} variant="outlined">
              <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>
                    {formatAdvance(reminder.advance)} vorher per E-Mail
                  </Typography>
                  <IconButton
                    onClick={() => handleDeleteReminder(reminder.id)}
                    disabled={disabled}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Card variant="outlined">
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="subtitle2">
            Neue Erinnerung hinzufügen
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "center",
            }}
          >
            <TextField
              label="Anzahl"
              type="number"
              value={newReminder.value}
              onChange={(e) =>
                setNewReminder({
                  ...newReminder,
                  value: Math.max(1, parseInt(e.target.value) || 1),
                })
              }
              size="small"
              disabled={disabled}
              slotProps={{ htmlInput: { min: 1 } }}
              sx={{ flex: 1 }}
            />
            <FormControl>
              <InputLabel>Einheit</InputLabel>
              <Select
                value={newReminder.unit}
                onChange={(e) =>
                  setNewReminder({
                    ...newReminder,
                    unit: e.target.value as AdvanceUnit,
                  })
                }
                size="small"
                label="Einheit"
                disabled={disabled}
                sx={{ flex: 1 }}
              >
                <MenuItem value="days">Tage vorher</MenuItem>
                <MenuItem value="weeks">Wochen vorher</MenuItem>
                <MenuItem value="months">Monate vorher</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddReminder}
              disabled={!canAddReminder}
            >
              Hinzufügen
            </Button>
          </Box>
        </CardContent>
      </Card>

      {reminders.length === 0 && (
        <Typography variant="body2" color="text.primary">
          Keine Erinnerungen konfiguriert. Füge eine Erinnerung hinzu, um vor
          Ablauf benachrichtigt zu werden.
        </Typography>
      )}
    </Stack>
  );
}

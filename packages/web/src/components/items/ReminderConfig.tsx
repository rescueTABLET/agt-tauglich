import {
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
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { useState } from "react";
import { type Reminder, type ReminderData, type Advance } from "../../model";

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
                    size="small"
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
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Neue Erinnerung hinzufügen
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
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
              sx={{ width: 120 }}
              disabled={disabled}
              inputProps={{ min: 1 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Einheit</InputLabel>
              <Select
                value={newReminder.unit}
                onChange={(e) =>
                  setNewReminder({
                    ...newReminder,
                    unit: e.target.value as AdvanceUnit,
                  })
                }
                label="Einheit"
                disabled={disabled}
              >
                <MenuItem value="days">Tage</MenuItem>
                <MenuItem value="weeks">Wochen</MenuItem>
                <MenuItem value="months">Monate</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              vorher per E-Mail
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddReminder}
              disabled={!canAddReminder}
              size="small"
            >
              Hinzufügen
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {reminders.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Keine Erinnerungen konfiguriert. Füge eine Erinnerung hinzu, um
          vor Ablauf benachrichtigt zu werden.
        </Typography>
      )}
    </Stack>
  );
}
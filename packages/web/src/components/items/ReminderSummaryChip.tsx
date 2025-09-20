import { Notifications } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { type Advance, type Item, type Reminder } from "../../model";

export default function ReminderSummaryChip({ item }: { item: Item }) {
  return (
    <>
      {(item.reminders ?? []).map((reminder) => (
        <Chip
          key={reminder.id}
          icon={<Notifications />}
          label={getReminderLabel(reminder)}
          variant="outlined"
          size="small"
        />
      ))}
    </>
  );
}

const formatAdvance = (advance: Advance): string => {
  if ("days" in advance) {
    return `${advance.days} ${advance.days === 1 ? "Tag" : "Tage"}`;
  }
  if ("weeks" in advance) {
    return `${advance.weeks} ${advance.weeks === 1 ? "Woche" : "Wochen"}`;
  }
  return `${advance.months} ${advance.months === 1 ? "Monat" : "Monate"}`;
};

const getReminderLabel = (reminder: Reminder) => {
  return `${formatAdvance(reminder.advance)} vorher`;
};

import {
  CheckCircle,
  Delete,
  Edit,
  Notifications,
  Warning,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { type Advance, type Item } from "../../model";

interface ItemListItemProps {
  item: Item;
  divider?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ItemListItem({
  item,
  divider,
  onEdit,
  onDelete,
}: ItemListItemProps) {
  const validUntilDate = new Date(item.validUntil);
  const today = new Date();
  const timeDiff = validUntilDate.getTime() - today.getTime();
  const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));

  const getStatusInfo = () => {
    if (daysUntilExpiry < 0) {
      return {
        color: "error" as const,
        icon: <Warning />,
        text: `abgelaufen vor ${Math.abs(daysUntilExpiry)} Tag${Math.abs(daysUntilExpiry) === 1 ? "" : "en"}`,
      };
    } else if (daysUntilExpiry === 0) {
      return {
        color: "warning" as const,
        icon: <Warning />,
        text: "läuft heute ab",
      };
    } else if (daysUntilExpiry <= 30) {
      return {
        color: "warning" as const,
        icon: <Warning />,
        text: `noch ${daysUntilExpiry} Tag${daysUntilExpiry === 1 ? "" : "e"}`,
      };
    } else {
      return {
        color: "success" as const,
        icon: <CheckCircle />,
        text: `noch ${daysUntilExpiry} Tag${daysUntilExpiry === 1 ? "" : "e"}`,
      };
    }
  };

  const statusInfo = getStatusInfo();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAdvance = (advance: Advance): string => {
    if ("days" in advance) {
      return `${advance.days} ${advance.days === 1 ? "Tag" : "Tage"}`;
    }
    if ("weeks" in advance) {
      return `${advance.weeks} ${advance.weeks === 1 ? "Woche" : "Wochen"}`;
    }
    return `${advance.months} ${advance.months === 1 ? "Monat" : "Monate"}`;
  };

  const getReminderSummary = () => {
    if (!item.reminders || item.reminders.length === 0) {
      return null;
    }

    if (item.reminders.length === 1) {
      return `${formatAdvance(item.reminders[0].advance)} vorher`;
    }

    return `${item.reminders.length} Erinnerungen`;
  };

  const reminderSummary = getReminderSummary();

  return (
    <ListItem
      divider={divider}
      secondaryAction={
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Chip
            icon={statusInfo.icon}
            label={statusInfo.text}
            color={statusInfo.color}
            size="small"
          />
          {reminderSummary && (
            <Chip
              icon={<Notifications />}
              label={reminderSummary}
              variant="outlined"
              size="small"
            />
          )}
          <IconButton
            onClick={onEdit}
            size="small"
            aria-label={`${item.label} bearbeiten`}
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={onDelete}
            size="small"
            color="error"
            edge="end"
            aria-label={`${item.label} löschen`}
          >
            <Delete />
          </IconButton>
        </Box>
      }
    >
      <ListItemText
        primary={
          <Typography variant="h6" component="div">
            {item.label}
          </Typography>
        }
        secondary={`Gültig bis: ${formatDate(item.validUntil)}`}
      />
    </ListItem>
  );
}

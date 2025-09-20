import { CheckCircle, Delete, Edit, Warning } from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { type Item } from "../../model";

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

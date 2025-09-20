import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
} from "@mui/material";
import { type Item } from "../../model";
import ItemStatusChip from "./ItemStatusChip";
import ReminderSummaryChip from "./ReminderSummaryChip";

interface ItemListItemProps {
  item: Item;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ItemListItem({
  item,
  onEdit,
  onDelete,
}: ItemListItemProps) {
  return (
    <Card sx={{ display: "flex", flexDirection: "column" }}>
      <CardHeader
        title={item.label}
        subheader={`Gültig bis: ${formatDate(item.validUntil)}`}
      />
      <CardContent
        sx={{ display: "flex", flexWrap: "wrap", gap: 1, flex: "1 0 auto" }}
      >
        <ItemStatusChip item={item} />
        <ReminderSummaryChip item={item} />
      </CardContent>
      <CardActions>
        <Button color="inherit" startIcon={<Edit />} onClick={onEdit}>
          Bearbeiten
        </Button>
        <Button color="inherit" startIcon={<Delete />} onClick={onDelete}>
          Löschen
        </Button>
      </CardActions>
    </Card>
  );
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

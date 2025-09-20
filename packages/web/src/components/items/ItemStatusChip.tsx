import { CheckCircle, Warning } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { type Item } from "../../model";

export default function ItemStatusChip({ item }: { item: Item }) {
  const statusInfo = getStatusInfo(item);

  return (
    <Chip
      icon={statusInfo.icon}
      label={statusInfo.text}
      color={statusInfo.color}
      size="small"
    />
  );
}

const getStatusInfo = (item: Item) => {
  const validUntilDate = new Date(item.validUntil);
  const today = new Date();
  const timeDiff = validUntilDate.getTime() - today.getTime();
  const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));

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

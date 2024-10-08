import { ArrowForward } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import DatenschutzInfo from "./DatenschutzInfo";
import { useNextStep } from "./hooks";

export default function Willkommen() {
  const nextStep = useNextStep();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h4" component="h1">
        Herzlich Willkommen!
      </Typography>
      <Typography>
        Mit dieser App kannst du deine Tauglichkeit als Atemschutzgeräteträger
        der Feuerwehr nach der FwDV 7 selbst überwachen.
      </Typography>
      <DatenschutzInfo />
      <Button
        variant="contained"
        size="large"
        endIcon={<ArrowForward />}
        onClick={nextStep}
      >
        Los geht's!
      </Button>
    </Box>
  );
}

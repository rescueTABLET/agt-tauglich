import { Box, Link, Typography } from "@mui/material";
import { Logo as RescueTabletLogo } from "@rescuetablet/theme";
import { version } from "../config";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        flexDirection: "column",
        py: 1,
        color: "text.secondary",
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography variant="caption">powered by</Typography>
        <Link href="https://rescuetablet.de/" target="_blank" color="inherit">
          <Box
            component={RescueTabletLogo}
            sx={{ width: "8rem" }}
            aria-label="rescueTABLET"
          />
        </Link>
      </Box>
      <Typography variant="caption" textAlign="center">
        <Link
          href="https://rescuetablet.de/impressum"
          target="_blank"
          color="inherit"
        >
          Impressum
        </Link>
        {" | "}
        <Link
          href="https://rescuetablet.de/datenschutz"
          target="_blank"
          color="inherit"
        >
          Datenschutz
        </Link>
        {" | "}
        {version}
      </Typography>
    </Box>
  );
}

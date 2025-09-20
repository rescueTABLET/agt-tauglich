import { ThumbUp } from "@mui/icons-material";
import { Box, CircularProgress } from "@mui/material";
import Delay from "./Delay";

export default function GlobalLoading() {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          bgcolor: "background.paper",
          borderRadius: "50%",
          boxShadow: 1,
          width: "8rem",
          height: "8rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Delay ms={300}>
          <CircularProgress
            size="100%"
            color="secondary"
            thickness={2}
            sx={{ position: "absolute", inset: 0 }}
          />
        </Delay>
        <ThumbUp
          sx={{ fontSize: "4rem", color: "primary.main", position: "relative" }}
        />
      </Box>
    </Box>
  );
}

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
          bgcolor: "primary.main",
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
            thickness={2}
            color="inherit"
            sx={{ color: "primary.light", position: "absolute", inset: 0 }}
          />
        </Delay>
        <ThumbUp
          sx={{
            fontSize: "4rem",
            color: "common.white",
            position: "relative",
          }}
        />
      </Box>
    </Box>
  );
}

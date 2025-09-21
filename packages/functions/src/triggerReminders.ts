import { addDays } from "date-fns";
import { onRequest } from "firebase-functions/v2/https";
import { sendReminders } from "./sendReminders";

export const triggerReminders = onRequest(async (req, res) => {
  const threshold =
    typeof req.query.threshold === "string"
      ? new Date(req.query.threshold)
      : addDays(new Date(), -30);

  const count = await sendReminders(threshold);

  res.send(
    JSON.stringify({
      count,
      threshold: threshold.toISOString().substring(0, 10),
    })
  );
});

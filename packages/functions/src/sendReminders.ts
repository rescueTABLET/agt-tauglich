import { format } from "date-fns";
import * as logger from "firebase-functions/logger";

export async function sendReminders(threshold: Date) {
  logger.info(
    "Sending reminders for threshold %s",
    format(threshold, "yyyy-MM-dd")
  );

  // FIXME implement
}

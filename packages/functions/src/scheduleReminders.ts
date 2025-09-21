import { addDays } from "date-fns";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { sendReminders } from "./sendReminders";

export const scheduleReminders = onSchedule("0 7 * * *", async () => {
  const threshold = addDays(new Date(), -30);
  await sendReminders(threshold);
});

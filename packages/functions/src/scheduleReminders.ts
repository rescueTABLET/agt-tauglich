import { addDays } from "date-fns";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { sendRemindersCronParam } from "./params";
import { sendReminders } from "./sendReminders";

export const scheduleReminders = onSchedule(
  sendRemindersCronParam.value(),
  async () => {
    const threshold = addDays(new Date(), -30);
    await sendReminders(threshold);
  }
);

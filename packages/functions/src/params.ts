import { defineString } from "firebase-functions/params";

export const appUrlParam = defineString("APP_URL", {
  default: "https://agt-tauglich.web.app",
});

export const sendRemindersCronParam = defineString("SEND_REMINDERS_CRON", {
  default: "0 7 * * *",
});

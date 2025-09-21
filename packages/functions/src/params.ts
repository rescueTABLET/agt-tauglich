import { defineString } from "firebase-functions/params";

export const appUrlParam = defineString("APP_URL", {
  default: "https://agt-tauglich.web.app",
});

export const sendRemindersCronParam = defineString("SEND_REMINDERS_CRON", {
  default: "0 7 * * *",
});

// AWS SES Configuration
export const sesRegionParam = defineString("SES_REGION", {
  default: "eu-central-1",
});

export const sesFromEmailParam = defineString("SES_FROM_EMAIL");

export const sesFromNameParam = defineString("SES_FROM_NAME", {
  default: "rescueTABLET",
});

export const awsAccessKeyIdParam = defineString("AWS_ACCESS_KEY_ID");

export const awsSecretAccessKeyParam = defineString("AWS_SECRET_ACCESS_KEY");

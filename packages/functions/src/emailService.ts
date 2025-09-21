import * as logger from "firebase-functions/logger";
import { sendEmailNotification as sendViaSES } from "./sesEmailService";

export interface EmailNotification {
  recipient: { address: string; name?: string };
  subject: string;
  body: string;
}

export async function sendEmailNotification(
  notification: EmailNotification
): Promise<void> {
  // Check if we're in a test environment
  if (process.env.NODE_ENV === "test" || process.env.VITEST === "true") {
    // Use mock implementation for tests
    logger.info("Mock email notification sent:", notification);
    await new Promise((resolve) => setTimeout(resolve, 100));
    return;
  }

  // Use SES for production
  try {
    await sendViaSES(notification);
  } catch (error) {
    // Log the error but don't throw to prevent breaking the reminder flow
    logger.error(
      "Failed to send email notification",
      {
        recipient: notification.recipient.address,
        subject: notification.subject,
        error: error instanceof Error ? error.message : String(error),
      },
      error
    );

    // In production, we might want to add the email to a retry queue
    // For now, we'll just log the failure
  }
}

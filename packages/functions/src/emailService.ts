import * as logger from "firebase-functions/logger";

export interface EmailNotification {
  recipient: { address: string; name?: string };
  subject: string;
  body: string;
}

export async function sendEmailNotification(
  notification: EmailNotification
): Promise<void> {
  // Mock implementation - in a real scenario, this would integrate with an email service
  // like SendGrid, Amazon SES, or Firebase Email Extensions
  logger.info("Mock email notification sent:", notification);

  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 100));
}

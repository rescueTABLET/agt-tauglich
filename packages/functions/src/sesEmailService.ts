import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import * as logger from "firebase-functions/logger";
import {
  sesRegionParam,
  sesFromEmailParam,
  sesFromNameParam,
  awsAccessKeyIdParam,
  awsSecretAccessKeyParam,
} from "./params";

export interface EmailNotification {
  recipient: { address: string; name?: string };
  subject: string;
  body: string;
}

class SESEmailService {
  private sesClient: SESClient | null = null;
  private fromEmail: string = "";
  private fromName: string = "";

  constructor() {
    // Only initialize SES in production environment
    if (process.env.NODE_ENV !== "test" && process.env.VITEST !== "true") {
      this.sesClient = new SESClient({
        region: sesRegionParam.value(),
        credentials: {
          accessKeyId: awsAccessKeyIdParam.value(),
          secretAccessKey: awsSecretAccessKeyParam.value(),
        },
      });
      
      this.fromEmail = sesFromEmailParam.value();
      this.fromName = sesFromNameParam.value();
    }
  }

  async sendEmailNotification(notification: EmailNotification): Promise<void> {
    if (!this.sesClient) {
      throw new Error("SES client not initialized - running in test environment");
    }

    const fromAddress = `${this.fromName} <${this.fromEmail}>`;
    const toAddress = notification.recipient.name
      ? `${notification.recipient.name} <${notification.recipient.address}>`
      : notification.recipient.address;

    const params = {
      Source: fromAddress,
      Destination: {
        ToAddresses: [toAddress],
      },
      Message: {
        Subject: {
          Data: notification.subject,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: notification.body,
            Charset: "UTF-8",
          },
        },
      },
    };

    try {
      const command = new SendEmailCommand(params);
      const result = await this.sesClient.send(command);
      
      logger.info("Email sent successfully via SES", {
        messageId: result.MessageId,
        recipient: notification.recipient.address,
        subject: notification.subject,
      });
    } catch (error) {
      logger.error("Failed to send email via SES", {
        recipient: notification.recipient.address,
        subject: notification.subject,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

// Export a singleton instance
export const sesEmailService = new SESEmailService();

// Export the function for compatibility with existing code
export async function sendEmailNotification(notification: EmailNotification): Promise<void> {
  return sesEmailService.sendEmailNotification(notification);
}
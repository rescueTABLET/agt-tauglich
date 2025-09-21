import { addDays, addMonths, addWeeks, format, parseISO } from "date-fns";
import * as logger from "firebase-functions/logger";
import { sendEmailNotification } from "./emailService";
import { paginatedUsers } from "./userLoader";

type Advance = { days: number } | { weeks: number } | { months: number };

type ReminderData = {
  advance: Advance;
  channel: "email";
};

type FirestoreItemData = {
  label: string;
  validUntil: string;
  reminders?: Record<string, ReminderData>;
};

type FirestoreUserData = {
  email: string;
  displayName?: string;
  items?: Record<string, FirestoreItemData>;
};

function calculateReminderDate(validUntil: Date, advance: Advance): Date {
  if ("days" in advance) {
    return addDays(validUntil, -advance.days);
  } else if ("weeks" in advance) {
    return addWeeks(validUntil, -advance.weeks);
  } else if ("months" in advance) {
    return addMonths(validUntil, -advance.months);
  }
  throw new Error("Invalid advance configuration");
}

function formatDateForDisplay(date: Date): string {
  return format(date, "dd.MM.yyyy");
}

async function processItemReminders(
  userId: string,
  itemId: string,
  itemData: FirestoreItemData,
  userEmail: string,
  userDisplayName: string | undefined,
  threshold: Date
): Promise<number> {
  let reminderCount = 0;

  if (!itemData.reminders) {
    return reminderCount;
  }

  const validUntilDate = parseISO(itemData.validUntil);
  const thresholdStr = format(threshold, "yyyy-MM-dd");

  // Check each reminder for this item
  for (const [reminderId, reminderData] of Object.entries(itemData.reminders)) {
    // Only process email reminders for now
    if (reminderData.channel !== "email") {
      continue;
    }

    try {
      const reminderDate = calculateReminderDate(
        validUntilDate,
        reminderData.advance
      );

      // Check if this reminder should be sent on the threshold date
      const reminderDateStr = format(reminderDate, "yyyy-MM-dd");

      if (reminderDateStr === thresholdStr) {
        // Send the reminder
        const subject = `${itemData.label} läuft bald ab`;
        const body = `Hallo ${userDisplayName || ""},

Deine Tauglichkeit "${itemData.label}" läuft am ${formatDateForDisplay(validUntilDate)} ab.

Vergiss nicht, sie rechtzeitig zu verlängern!

Viele Grüße
Dein rescueTABLET Team

https://tauglich.rescuetablet.com/
`;

        await sendEmailNotification({
          recipient: { address: userEmail, name: userDisplayName },
          subject,
          body,
        });

        reminderCount++;

        logger.info("Reminder sent", {
          userId,
          itemId,
          reminderId,
          itemLabel: itemData.label,
          validUntil: itemData.validUntil,
          recipient: userEmail,
        });
      }
    } catch (error) {
      logger.error("Error processing reminder", {
        userId,
        itemId,
        reminderId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return reminderCount;
}

async function processUserDocument(
  userDoc: FirebaseFirestore.QueryDocumentSnapshot,
  threshold: Date
): Promise<number> {
  const userData = userDoc.data() as FirestoreUserData;
  let reminderCount = 0;

  if (!userData.items) {
    return reminderCount;
  }

  // Process all items for this user concurrently
  const itemPromises = Object.entries(userData.items).map(
    async ([itemId, itemData]) => {
      try {
        return await processItemReminders(
          userDoc.id,
          itemId,
          itemData,
          userData.email,
          userData.displayName,
          threshold
        );
      } catch (error) {
        logger.error("Error processing item reminders", {
          userId: userDoc.id,
          itemId,
          error: error instanceof Error ? error.message : String(error),
        });
        return 0;
      }
    }
  );

  const itemResults = await Promise.all(itemPromises);
  reminderCount = itemResults.reduce((sum, count) => sum + count, 0);

  return reminderCount;
}

export async function sendReminders(threshold: Date): Promise<void> {
  logger.info(
    "Sending reminders for threshold %s",
    format(threshold, "yyyy-MM-dd")
  );

  let reminderCount = 0;
  const PAGE_SIZE = 100;

  try {
    let userCount = 0;

    // Use the async generator for paginated user loading
    for await (const usersBatch of paginatedUsers(PAGE_SIZE)) {
      userCount += usersBatch.length;
      logger.info(
        `Processing users batch: ${usersBatch.length} users (total processed: ${userCount})`
      );

      // Process all users in this batch concurrently
      const userPromises = usersBatch.map(async (userDoc) => {
        try {
          return await processUserDocument(userDoc, threshold);
        } catch (error) {
          logger.error("Error processing user document", {
            userId: userDoc.id,
            error: error instanceof Error ? error.message : String(error),
          });
          return 0;
        }
      });

      const batchResults = await Promise.all(userPromises);
      const batchReminderCount = batchResults.reduce(
        (sum, count) => sum + count,
        0
      );
      reminderCount += batchReminderCount;
    }

    logger.info(
      `Sent ${reminderCount} reminders for threshold ${format(threshold, "yyyy-MM-dd")} (processed ${userCount} users)`
    );
  } catch (error) {
    logger.error("Error sending reminders", {
      threshold: format(threshold, "yyyy-MM-dd"),
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

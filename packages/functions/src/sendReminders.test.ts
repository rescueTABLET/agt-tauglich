import { beforeEach, describe, expect, it, vi } from "vitest";
import * as emailService from "./emailService";
import { sendReminders } from "./sendReminders";
import * as userLoader from "./userLoader";

// Mock the dependencies
vi.mock("./userLoader");
vi.mock("./emailService");

const mockPaginatedUsers = vi.mocked(userLoader.paginatedUsers);
const mockSendEmailNotification = vi.mocked(emailService.sendEmailNotification);

describe("sendReminders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle empty user collection", async () => {
    // Arrange
    const threshold = new Date("2024-01-15");
    mockPaginatedUsers.mockImplementation(async function* () {
      // Yield no batches (empty collection)
    });

    // Act & Assert
    await expect(sendReminders(threshold)).resolves.toBeUndefined();

    expect(mockPaginatedUsers).toHaveBeenCalledWith(100);
    expect(mockSendEmailNotification).not.toHaveBeenCalled();
  });

  it("should process users with no items", async () => {
    // Arrange
    const threshold = new Date("2024-01-15");
    const mockUserDoc = {
      id: "user1",
      data: () => ({
        email: "user1@example.com",
        displayName: "User One",
        items: {},
      }),
    } as any;

    mockPaginatedUsers.mockImplementation(async function* () {
      yield [mockUserDoc];
    });

    // Act & Assert
    await expect(sendReminders(threshold)).resolves.toBeUndefined();

    expect(mockPaginatedUsers).toHaveBeenCalledWith(100);
    expect(mockSendEmailNotification).not.toHaveBeenCalled();
  });

  it("should send reminders for items with matching threshold dates", async () => {
    // Arrange
    const threshold = new Date("2024-01-15");
    const mockUserDoc = {
      id: "user1",
      data: () => ({
        email: "user1@example.com",
        displayName: "John Doe",
        items: {
          item1: {
            label: "First Aid Training",
            validUntil: "2024-02-14", // 30 days from threshold
            reminders: {
              reminder1: {
                advance: { days: 30 },
                channel: "email" as const,
              },
            },
          },
          item2: {
            label: "Safety Training",
            validUntil: "2024-02-20", // Should not trigger (36 days)
            reminders: {
              reminder2: {
                advance: { days: 30 },
                channel: "email" as const,
              },
            },
          },
        },
      }),
    } as any;

    mockPaginatedUsers.mockImplementation(async function* () {
      yield [mockUserDoc];
    });

    mockSendEmailNotification.mockResolvedValue();

    // Act
    await sendReminders(threshold);

    // Assert
    expect(mockSendEmailNotification).toHaveBeenCalledTimes(1);
    expect(mockSendEmailNotification).toHaveBeenCalledWith({
      recipient: { address: "user1@example.com", name: "John Doe" },
      subject: "First Aid Training läuft bald ab",
      body: expect.stringContaining("First Aid Training"),
    });
  });

  it("should handle multiple users with different reminder configurations", async () => {
    // Arrange
    const threshold = new Date("2024-01-15");

    const mockUser1 = {
      id: "user1",
      data: () => ({
        email: "user1@example.com",
        displayName: "User One",
        items: {
          item1: {
            label: "Training A",
            validUntil: "2024-02-29", // 45 days from threshold
            reminders: {
              reminder1: {
                advance: { days: 45 },
                channel: "email" as const,
              },
            },
          },
        },
      }),
    } as any;

    const mockUser2 = {
      id: "user2",
      data: () => ({
        email: "user2@example.com",
        displayName: "User Two",
        items: {
          item2: {
            label: "Training B",
            validUntil: "2024-02-08", // 24 days from threshold
            reminders: {
              reminder2: {
                advance: { weeks: 3 }, // 21 days
                channel: "email" as const,
              },
            },
          },
        },
      }),
    } as any;

    mockPaginatedUsers.mockImplementation(async function* () {
      yield [mockUser1, mockUser2];
    });

    mockSendEmailNotification.mockResolvedValue();

    // Act
    await sendReminders(threshold);

    // Assert
    expect(mockSendEmailNotification).toHaveBeenCalledTimes(1);
    expect(mockSendEmailNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        recipient: { address: "user1@example.com", name: "User One" },
        subject: "Training A läuft bald ab",
      })
    );
  });

  it("should handle different advance configurations", async () => {
    // Arrange
    const threshold = new Date("2024-01-15");
    const mockUserDoc = {
      id: "user1",
      data: () => ({
        email: "user1@example.com",
        displayName: "Test User",
        items: {
          item1: {
            label: "Days Training",
            validUntil: "2024-02-14", // 30 days
            reminders: {
              reminder1: { advance: { days: 30 }, channel: "email" as const },
            },
          },
          item2: {
            label: "Weeks Training",
            validUntil: "2024-02-05", // 21 days (3 weeks)
            reminders: {
              reminder2: { advance: { weeks: 3 }, channel: "email" as const },
            },
          },
          item3: {
            label: "Months Training",
            validUntil: "2024-02-15", // ~1 month
            reminders: {
              reminder3: { advance: { months: 1 }, channel: "email" as const },
            },
          },
        },
      }),
    } as any;

    mockPaginatedUsers.mockImplementation(async function* () {
      yield [mockUserDoc];
    });

    mockSendEmailNotification.mockResolvedValue();

    // Act
    await sendReminders(threshold);

    // Assert - Should send 3 reminders
    expect(mockSendEmailNotification).toHaveBeenCalledTimes(3);

    const calls = mockSendEmailNotification.mock.calls;
    const subjects = calls.map((call) => call[0].subject);

    expect(subjects).toMatchInlineSnapshot(`
      [
        "Days Training läuft bald ab",
        "Weeks Training läuft bald ab",
        "Months Training läuft bald ab",
      ]
    `);
  });

  it("should skip non-email reminder channels", async () => {
    // Arrange
    const threshold = new Date("2024-01-15");
    const mockUserDoc = {
      id: "user1",
      data: () => ({
        email: "user1@example.com",
        displayName: "Test User",
        items: {
          item1: {
            label: "SMS Training",
            validUntil: "2024-02-14",
            reminders: {
              reminder1: { advance: { days: 30 }, channel: "sms" as any },
            },
          },
        },
      }),
    } as any;

    mockPaginatedUsers.mockImplementation(async function* () {
      yield [mockUserDoc];
    });

    // Act
    await sendReminders(threshold);

    // Assert
    expect(mockSendEmailNotification).not.toHaveBeenCalled();
  });

  it("should handle user processing errors gracefully", async () => {
    // Arrange
    const threshold = new Date("2024-01-15");
    const mockUserDoc = {
      id: "user1",
      data: () => {
        throw new Error("Firestore error");
      },
    } as any;

    mockPaginatedUsers.mockImplementation(async function* () {
      yield [mockUserDoc];
    });

    // Act & Assert - Should not throw
    await expect(sendReminders(threshold)).resolves.toBeUndefined();
    expect(mockSendEmailNotification).not.toHaveBeenCalled();
  });

  it("should format email body correctly", async () => {
    // Arrange
    const threshold = new Date("2024-01-15");
    const mockUserDoc = {
      id: "user1",
      data: () => ({
        email: "test@example.com",
        displayName: "Max Mustermann",
        items: {
          item1: {
            label: "Erste Hilfe Kurs",
            validUntil: "2024-02-14",
            reminders: {
              reminder1: { advance: { days: 30 }, channel: "email" as const },
            },
          },
        },
      }),
    } as any;

    mockPaginatedUsers.mockImplementation(async function* () {
      yield [mockUserDoc];
    });

    mockSendEmailNotification.mockResolvedValue();

    // Act
    await sendReminders(threshold);

    // Assert
    expect(mockSendEmailNotification).toHaveBeenCalledWith({
      recipient: { address: "test@example.com", name: "Max Mustermann" },
      subject: "Erste Hilfe Kurs läuft bald ab",
      body: expect.stringMatching(/Hallo Max Mustermann/),
    });

    const emailBody = mockSendEmailNotification.mock.calls[0][0].body;
    expect(emailBody).toMatchInlineSnapshot(`
      "Hallo Max Mustermann,

      Deine Tauglichkeit "Erste Hilfe Kurs" läuft am 14.02.2024 ab.

      Vergiss nicht, sie rechtzeitig zu verlängern!

      Viele Grüße
      Dein rescueTABLET Team

      https://tauglich.rescuetablet.com/
      "
    `);
  });
});

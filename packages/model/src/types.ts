export type Identifiable = { id: string };

export type User = Identifiable & UserData;

export type UserData = {
  email: string;
  displayName?: string;
  items?: ReadonlyArray<Item>;
};

export type Item = Identifiable & ItemData;

export type ItemData = {
  label: string;
  expiration: number;
  reminders?: ReadonlyArray<Reminder>;
};

export type Reminder = Identifiable & ReminderData;

export type ReminderData = {
  advance: Advance;
  channel: ChannelType;
};

export type Advance = { days: number } | { weeks: number } | { months: number };

export type ChannelType = "email";

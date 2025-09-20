import { Item, ItemData, User, UserData, Reminder, ReminderData } from "./types";

// Firestore-specific types (using maps instead of arrays)
export type FirestoreItemData = {
  label: string;
  validUntil: string;
  reminders?: Record<string, ReminderData>;
};

export type FirestoreUserData = {
  email: string;
  displayName?: string;
  items?: Record<string, FirestoreItemData>;
};

export type FirestoreUser = {
  id: string;
} & FirestoreUserData;

// Conversion functions from domain model to Firestore model
export function toFirestoreUserData(userData: UserData): FirestoreUserData {
  const { items, ...rest } = userData;

  if (!items || items.length === 0) {
    return {
      ...rest,
      items: {},
    };
  }

  const itemsMap: Record<string, FirestoreItemData> = {};
  for (const item of items) {
    const { id, ...itemData } = item;
    itemsMap[id] = toFirestoreItemData(itemData);
  }

  return {
    ...rest,
    items: itemsMap,
  };
}

export function toFirestoreUser(user: User): FirestoreUser {
  const { id, ...userData } = user;
  return {
    id,
    ...toFirestoreUserData(userData),
  };
}

// Conversion functions from Firestore model to domain model
export function fromFirestoreUserData(
  firestoreData: FirestoreUserData
): UserData {
  const { items, ...rest } = firestoreData;

  if (!items || Object.keys(items).length === 0) {
    return {
      ...rest,
      items: [],
    };
  }

  const itemsArray: Item[] = [];
  for (const [id, firestoreItemData] of Object.entries(items)) {
    const itemData = fromFirestoreItemData(firestoreItemData);
    itemsArray.push({
      id,
      ...itemData,
    });
  }

  return {
    ...rest,
    items: itemsArray,
  };
}

export function fromFirestoreUser(firestoreUser: FirestoreUser): User {
  const { id, ...firestoreData } = firestoreUser;
  return {
    id,
    ...fromFirestoreUserData(firestoreData),
  };
}

// Helper functions for item operations
export function addItemToFirestoreData(
  firestoreData: FirestoreUserData,
  itemId: string,
  itemData: ItemData
): FirestoreUserData {
  return {
    ...firestoreData,
    items: {
      ...firestoreData.items,
      [itemId]: toFirestoreItemData(itemData),
    },
  };
}

export function updateItemInFirestoreData(
  firestoreData: FirestoreUserData,
  itemId: string,
  itemData: ItemData
): FirestoreUserData {
  if (!firestoreData.items || !firestoreData.items[itemId]) {
    return firestoreData;
  }

  return {
    ...firestoreData,
    items: {
      ...firestoreData.items,
      [itemId]: toFirestoreItemData(itemData),
    },
  };
}

export function removeItemFromFirestoreData(
  firestoreData: FirestoreUserData,
  itemId: string
): FirestoreUserData {
  if (!firestoreData.items || !firestoreData.items[itemId]) {
    return firestoreData;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [itemId]: removed, ...remainingItems } = firestoreData.items;

  return {
    ...firestoreData,
    items: remainingItems,
  };
}

// Conversion functions for ItemData with reminders
export function toFirestoreItemData(itemData: ItemData): FirestoreItemData {
  const { reminders, ...rest } = itemData;

  if (!reminders || reminders.length === 0) {
    return {
      ...rest,
      reminders: {},
    };
  }

  const remindersMap: Record<string, ReminderData> = {};
  for (const reminder of reminders) {
    const { id, ...reminderData } = reminder;
    remindersMap[id] = reminderData;
  }

  return {
    ...rest,
    reminders: remindersMap,
  };
}

export function fromFirestoreItemData(firestoreItemData: FirestoreItemData): ItemData {
  const { reminders, ...rest } = firestoreItemData;

  if (!reminders || Object.keys(reminders).length === 0) {
    return {
      ...rest,
      reminders: [],
    };
  }

  const remindersArray: Reminder[] = [];
  for (const [id, reminderData] of Object.entries(reminders)) {
    remindersArray.push({
      id,
      ...reminderData,
    });
  }

  return {
    ...rest,
    reminders: remindersArray,
  };
}

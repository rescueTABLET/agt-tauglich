import { User as FirebaseUser } from "firebase/auth";
import {
  doc,
  type FirestoreError,
  getDoc,
  onSnapshot,
  setDoc,
  type Unsubscribe,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  type FirestoreUserData,
  fromFirestoreUserData,
  type ItemData,
  toFirestoreItemData,
  toFirestoreUserData,
  type User,
  type UserData,
} from "../model";

export async function getUserData(user: FirebaseUser): Promise<User | null> {
  const userDoc = doc(db, "users", user.uid);
  const docSnap = await getDoc(userDoc);

  if (docSnap.exists()) {
    const firestoreData = docSnap.data() as FirestoreUserData;
    const userData = fromFirestoreUserData(firestoreData);
    return { id: user.uid, ...userData };
  }

  return null;
}

export async function createUserData(user: FirebaseUser): Promise<User> {
  const userData: UserData = {
    email: user.email!,
    displayName: user.displayName || undefined,
    items: [],
  };

  const firestoreData = toFirestoreUserData(userData);
  const userDoc = doc(db, "users", user.uid);
  await setDoc(userDoc, firestoreData);

  return { id: user.uid, ...userData };
}

export async function ensureUserData(user: FirebaseUser): Promise<User> {
  const existingUser = await getUserData(user);
  if (existingUser) return existingUser;
  return createUserData(user);
}

export function subscribeToUserData(
  userId: string,
  callback: (userData: User | null) => void,
  onError: (error: FirestoreError) => void
): Unsubscribe {
  const userDoc = doc(db, "users", userId);

  return onSnapshot(
    userDoc,
    (docSnap) => {
      if (docSnap.exists()) {
        const firestoreData = docSnap.data() as FirestoreUserData;
        const userData = fromFirestoreUserData(firestoreData);
        callback({ id: userId, ...userData });
      } else {
        callback(null);
      }
    },
    onError
  );
}

export async function addItem(
  userId: string,
  itemData: ItemData
): Promise<void> {
  const itemId = crypto.randomUUID();
  const userDoc = doc(db, "users", userId);

  await updateDoc(userDoc, {
    [`items.${itemId}`]: toFirestoreItemData(itemData),
  });
}

export async function updateItem(
  userId: string,
  itemId: string,
  itemData: ItemData
): Promise<void> {
  const userDoc = doc(db, "users", userId);

  await updateDoc(userDoc, {
    [`items.${itemId}`]: toFirestoreItemData(itemData),
  });
}

export async function deleteItem(
  userId: string,
  itemId: string
): Promise<void> {
  const userDoc = doc(db, "users", userId);

  await updateDoc(userDoc, {
    [`items.${itemId}`]: null,
  });
}

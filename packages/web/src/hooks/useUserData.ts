import { useCallback, useEffect, useState } from "react";
import { type ItemData, type User } from "../model";
import {
  addItem,
  deleteItem,
  subscribeToUserData,
  updateItem,
} from "../services/userData";

export function useUserData(userId: string) {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return subscribeToUserData(
      userId,
      (data) => {
        setUserData(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setLoading(false);
        setError(err.message);
      },
    );
  }, [userId]);

  return { userData, loading, error };
}

export function useAddItem(userId: string): (data: ItemData) => Promise<void> {
  return useCallback(async (data) => addItem(userId, data), [userId]);
}

export function useUpdateItem(
  userId: string,
): (itemId: string, data: ItemData) => Promise<void> {
  return useCallback(
    async (itemId, data) => updateItem(userId, itemId, data),
    [userId],
  );
}

export function useDeleteItem(
  userId: string,
): (itemId: string) => Promise<void> {
  return useCallback(async (itemId) => deleteItem(userId, itemId), [userId]);
}

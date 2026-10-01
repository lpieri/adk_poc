import { useState } from "react";
import { createId } from "../utils/ids";
import { readStorage, writeStorage } from "../utils/storage";

export const USER_ID_KEY = "ale.userId";

export const resolveUserId = (): string => {
  const stored = readStorage(USER_ID_KEY);
  if (stored) {
    return stored;
  }
  const id = createId();
  writeStorage(USER_ID_KEY, id);
  return id;
};

export const useUserId = (): string => {
  const [userId] = useState<string>(resolveUserId);
  return userId;
};

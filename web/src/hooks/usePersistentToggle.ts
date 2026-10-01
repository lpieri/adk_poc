import { useCallback, useState } from "react";
import { readStorage, writeStorage } from "../utils/storage";

const ENABLED_VALUE = "1";

export const usePersistentToggle = (key: string): [boolean, (value: boolean) => void] => {
  const [value, setValue] = useState<boolean>(() => readStorage(key) === ENABLED_VALUE);
  const update = useCallback(
    (next: boolean) => {
      setValue(next);
      writeStorage(key, next ? ENABLED_VALUE : null);
    },
    [key],
  );
  return [value, update];
};

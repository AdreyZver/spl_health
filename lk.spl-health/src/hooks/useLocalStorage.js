import { useState } from "react";
import { StorageUtils } from "../utils/StorageUtils";

export const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = StorageUtils.getLocal(keyName);

      if (value) {
        return value;
      } else {
        StorageUtils.setLocal(keyName, defaultValue);

        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });

  const setValue = (newValue) => {
    try {
      StorageUtils.setLocal(keyName, newValue);
    } catch (err) { }

    setStoredValue(newValue);
  };

  return [storedValue, setValue];
};
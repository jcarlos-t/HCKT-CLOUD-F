import { useCallback, useEffect, useReducer } from "react";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
  return useReducer(
    (_: [boolean, T | null], action: T | null = null): [boolean, T | null] => [
      false,
      action,
    ],
    initialValue,
  );
}

export function useStorageState<T = string>(key: string): UseStateHook<T> {
  const [state, setState] = useAsyncState<T>();

  // Leer del localStorage al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        setState(null);
        return;
      }

      const parsed = JSON.parse(raw) as T;
      setState(parsed);
    } catch (error) {
      console.error("Error getting storage item: ", error);
      setState(null);
    }
  }, [key, setState]);

  const setValue = useCallback(
    (value: T | null) => {
      setState(value);

      try {
        if (value === null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.error("Error setting storage item: ", error);
      }
    },
    [key, setState],
  );

  return [state, setValue];
}

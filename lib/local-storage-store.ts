"use client";

import { useSyncExternalStore } from "react";

type Listener = () => void;

export interface LocalStorageStore<T> {
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  setValue: (value: T) => void;
  getValue: () => T;
}

export function createLocalStorageStore<T>(
  key: string,
  fallback: T,
): LocalStorageStore<T> {
  const listeners = new Set<Listener>();
  let initialized = false;
  let cached: T = fallback;

  function read(): T {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  function getSnapshot(): T {
    if (!initialized) {
      cached = read();
      initialized = true;
    }
    return cached;
  }

  function getServerSnapshot(): T {
    return fallback;
  }

  function subscribe(listener: Listener): () => void {
    if (typeof window !== "undefined") {
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          cached = read();
          listener();
        }
      };
      window.addEventListener("storage", onStorage);
      listeners.add(listener);
      return () => {
        window.removeEventListener("storage", onStorage);
        listeners.delete(listener);
      };
    }
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function setValue(value: T): void {
    cached = value;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // ignore
      }
    }
    listeners.forEach((l) => l());
  }

  function getValue(): T {
    return getSnapshot();
  }

  return { subscribe, getSnapshot, getServerSnapshot, setValue, getValue };
}

export function useLocalStorageStore<T>(
  store: LocalStorageStore<T>,
): [T, (value: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  const setValue = (next: T | ((prev: T) => T)) => {
    const prev = store.getValue();
    store.setValue(
      typeof next === "function" ? (next as (p: T) => T)(prev) : next,
    );
  };

  return [value, setValue];
}
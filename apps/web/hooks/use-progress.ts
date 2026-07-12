"use client";

import { useSyncExternalStore } from "react";

import { getAllLessonSlugs } from "@/content/course";

const STORAGE_KEY = "wa-progress";

const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

const EMPTY_SET = new Set<string>();

let cachedRaw: string | null = null;
let cachedSet: Set<string> = EMPTY_SET;

function getSnapshot(): Set<string> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSet = raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  }
  return cachedSet;
}

function getServerSnapshot(): Set<string> {
  return EMPTY_SET;
}

function subscribe(callback: () => void) {
  listeners.add(callback);

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function markComplete(slug: string) {
  const current = getSnapshot();
  if (current.has(slug)) {
    return;
  }
  const next = new Set([...current, slug]);
  cachedRaw = JSON.stringify([...next]);
  cachedSet = next;
  localStorage.setItem(STORAGE_KEY, cachedRaw);
  notify();
}

export const useProgress = () => {
  const completed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const total = getAllLessonSlugs().length;
  const percentage = total > 0 ? Math.round((completed.size / total) * 100) : 0;

  return { completed, markComplete, percentage };
};

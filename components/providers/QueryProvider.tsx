"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const storage = {
  getItem: async (key: string) => {
    return localStorage.getItem(key);
  },

  setItem: async (key: string, value: string) => {
    localStorage.setItem(key, value);
  },

  removeItem: async (key: string) => {
    localStorage.removeItem(key);
  },
};

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // data fresh for 5 min
            gcTime: 24 * 60 * 60 * 1000, // Keep unused data for 24 hrs
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const persister = createAsyncStoragePersister({
    storage,
  });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000,
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}

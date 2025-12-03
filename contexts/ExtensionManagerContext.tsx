"use client";

import costumeToast from "@/components/costume/costume_toast";
import React, { createContext, useContext, useState } from "react";

type ExtensionsManagerContextType = {
  extensions: Extensions[];
  loadExtensionsList: () => Promise<Extensions[]>;
  addNewExtension: (ext: Extensions) => void;
  setExtensions: React.Dispatch<React.SetStateAction<Extensions[]>>;
  loading: boolean;
  error: string | null;
};

const ExtensionsManager = createContext<ExtensionsManagerContextType | undefined>(undefined);

export function ExtensionsApiProvider({ children }: { children: React.ReactNode }) {
  const [extensions, setExtensions] = useState<Extensions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add item safely
  const addNewExtension = (ext: Extensions) => {
    setExtensions((prev) => [...prev, ext]);
  };

  // Load list from Electron API
  const loadExtensionsList = async (): Promise<Extensions[]> => {
    setLoading(true);
    setError(null);

    try {
      if (!window.electronAPI) {
        costumeToast({content: "Electron API wasn't ready", type:"ERROR"})
        setLoading(false);
        return [];
      }

      const list = await window.electronAPI.readExtensions();

      if (!Array.isArray(list)) {
        costumeToast({content:"Invalid extensions list returned from preload.", type:"ERROR"});
        setLoading(false);
        return [];
      }

      setExtensions(list);
      setLoading(false);
      return list;
    } catch (err) {
      costumeToast({content: "Failed to load extensions.", type:"ERROR"})
      setLoading(false);
      return [];
    }
  };

  return (
    <ExtensionsManager.Provider
      value={{
        extensions,
        setExtensions,
        addNewExtension,
        loadExtensionsList,
        loading,
        error,
      }}
    >
      {children}
    </ExtensionsManager.Provider>
  );
}

export const useExtensionsManager = () => {
  const ctx = useContext(ExtensionsManager);
  if (!ctx) throw new Error("useExtensionsManager must be used inside ExtensionsApiProvider");
  return ctx;
};

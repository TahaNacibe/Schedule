"use client"
import { read } from 'fs';
import React, { createContext, useContext, useState } from 'react';

type AppAPI = {
  insertText: (text: string) => void;
};

type AppContextType = {
  appAPI: AppAPI,
  updateExtensions: (newExtensions: Array<Extensions>) => void,
  readExtensions: () => Array<Extensions>,
  userSignedIn : boolean,
  setUserSignedIn : (state: boolean) => void,
  userId: string | null
  setUserId: (id:string | null) => void
}

const AppAPIContext = createContext<AppContextType | undefined>(undefined);

export function AppAPIProvider({ children }: { children: React.ReactNode }) {
  const [extensions, setExtensions] = useState<Array<Extensions>>([]);  // For storing extensions
  const [userSignedIn, setUserSignedIn] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const appAPI: AppAPI = {
    insertText: (text: string) => {
      // Your app's task: e.g., insert into an editor
      console.log(`Inserting: ${text}`);  // Placeholder
      // Real: document.getElementById('editor').innerHTML += text; or use Quill/Monaco
      alert(`Task done: Inserted "${text}"`);  // Visual feedback
    },
    // Add more: getUserData, saveFile, etc.
  };

  const updateExtensions = (newExtensions: Array<Extensions>) => { 
    setExtensions(newExtensions);
  }

  const readExtensions = () => { 
    return extensions;
  }


  return <AppAPIContext.Provider
    value={{ appAPI, updateExtensions, readExtensions, userSignedIn,
    setUserSignedIn,
    userId,
    setUserId 
    }}>
    {children}
  </AppAPIContext.Provider>;
}

export const useAppAPI = () => {
  const ctx = useContext(AppAPIContext);
  if (!ctx) {
    throw new Error('useAppAPI must be used within an AppAPIProvider');
  }
  return ctx;
};
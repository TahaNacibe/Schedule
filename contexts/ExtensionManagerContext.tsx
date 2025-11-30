"use client"
import React, { createContext, useContext, useState } from 'react';


type ExtensionsManagerContextType = {
    loadExtensionsList: () => Promise<Array<Extensions>>,
    readExtensions: () => Array<Extensions>,
    addNewExtension: (newExtension: Extensions) => void,
    getExtensionsLoadingState: () => boolean,
    updateExtensionsLoadingState: (newState:boolean) => void,
}

const ExtensionsManager = createContext<ExtensionsManagerContextType | undefined>(undefined);

export function ExtensionsApiProvider({ children }: { children: React.ReactNode }) {
    const [extensions, setExtensions] = useState<Array<Extensions>>([]);
    const [extensionLoadingError, setExtensionsLoadingError] = useState<string | null>(null)
    const [extensionsLoadingState, setExtensionsLoadingState] = useState(true)

    const addNewExtension = (newExtension: Extensions) => { 
        setExtensions(prev => [...prev, newExtension]);
    }

    const loadExtensionsList = async () => {
        setExtensionsLoadingState(true)
        if (window.electronAPI) {
            const extensionsList = await window.electronAPI.readExtensions();
            if (extensionsList) {
                setExtensions(extensionsList)
                setExtensionsLoadingState(false)
                return extensionsList
            } 
        } else {
            setExtensionsLoadingError("Electron API wan't ready as needed")
        }
        setExtensionsLoadingState(false)
        return []
    }

    const readExtensions = () => extensions;


    const getExtensionsLoadingState = () => extensionsLoadingState
    const updateExtensionsLoadingState = (newState: boolean) => {
        setExtensionsLoadingState(newState)
    }


    return <ExtensionsManager.Provider
    value={{ 
        loadExtensionsList,
        readExtensions,
        addNewExtension,
        getExtensionsLoadingState,
        updateExtensionsLoadingState
    }}>
    {children}
    </ExtensionsManager.Provider>;
}

export const useExtensionsManager = () => {
    const ctx = useContext(ExtensionsManager);
    if (!ctx) {
        throw new Error('useExtensionsManager must be used within an ExtensionsManagerProvider');
    }
    return ctx;
};
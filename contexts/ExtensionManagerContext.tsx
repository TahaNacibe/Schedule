"use client"
import React, { createContext, useContext, useState } from 'react';


type ExtensionsManagerContextType = {
    updateExtensionsList: (extensions: Array<Extensions>) => void,
    readExtensions: () => Array<Extensions>,
    addNewExtension: (newExtension: Extensions) => void,
    getExtensionsLoadingState: () => boolean,
    updateExtensionsLoadingState: (newState:boolean) => void,
}

const ExtensionsManager = createContext<ExtensionsManagerContextType | undefined>(undefined);

export function ExtensionsApiProvider({ children }: { children: React.ReactNode }) {
    const [extensions, setExtensions] = useState<Array<Extensions>>([]);
    const [extensionsLoadingState, setExtensionsLoadingState] = useState(true)

    const addNewExtension = (newExtension: Extensions) => { 
        setExtensions(prev => [...prev, newExtension]);
    }

    const updateExtensionsList = (extensions: Array<Extensions>) => {
        setExtensions(extensions)
    }

    const readExtensions = () => extensions;


    const getExtensionsLoadingState = () => extensionsLoadingState
    const updateExtensionsLoadingState = (newState: boolean) => {
        setExtensionsLoadingState(newState)
    }


    return <ExtensionsManager.Provider
    value={{ 
        updateExtensionsList,
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
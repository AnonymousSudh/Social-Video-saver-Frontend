// src/context/DownloadContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DownloadItem = {
    id: string;
    url: string;
    localPath: string;
    createdAt: string;
};

type DownloadContextType = {
    downloads: DownloadItem[];
    addDownload: (item: DownloadItem) => void;
    removeDownload: (id: string) => void;
    clearDownloads: () => void;
};

const DownloadContext = createContext<DownloadContextType | undefined>(undefined);

export const DownloadProvider = ({ children }: { children: ReactNode }) => {
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);

    const addDownload = (item: DownloadItem) => {
        setDownloads(prev => [item, ...prev]);
    };

    const removeDownload = (id: string) => {
        setDownloads(prev => prev.filter(d => d.id !== id));
    };

    const clearDownloads = () => {
        setDownloads([]);
    };

    return (
        <DownloadContext.Provider value={{ downloads, addDownload, removeDownload, clearDownloads }}>
            {children}
        </DownloadContext.Provider>
    );
};

export const useDownloadContext = () => {
    const ctx = useContext(DownloadContext);
    if (!ctx) {
        throw new Error('useDownloadContext must be used within DownloadProvider');
    }
    return ctx;
};

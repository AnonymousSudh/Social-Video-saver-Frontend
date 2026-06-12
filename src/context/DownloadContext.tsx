// src/context/DownloadContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import RNFS from 'react-native-fs';
import { 
  loadHistory, 
  addHistoryItem, 
  removeHistoryItem, 
  clearHistory, 
  DownloadItem 
} from '../services/history';
import { ensureAppDir, APP_DOWNLOAD_DIR, deleteFile } from '../services/fileSystem';
import { trackDownloadForAd } from '../services/ads';

export type ActiveDownload = {
  id: string;
  url: string; // Original URL
  downloadUrl: string; // Direct video URL
  title: string;
  thumbnail: string;
  author: string;
  duration: number;
  progress: number;
  status: 'queued' | 'downloading' | 'paused' | 'completed' | 'cancelled' | 'failed';
  downloadJobId: number | null;
  localPath: string;
  selectedQuality: string;
  fileSize: string;
};

type DownloadContextType = {
  downloads: DownloadItem[];
  activeQueue: ActiveDownload[];
  addDownload: (item: DownloadItem) => void;
  removeDownload: (id: string) => Promise<void>;
  clearDownloads: () => Promise<void>;
  addToQueue: (url: string, directUrl: string, title: string, thumbnail: string, author: string, duration: number, quality: string, size: string) => void;
  pauseDownload: (id: string) => void;
  resumeDownload: (id: string) => void;
  cancelDownload: (id: string) => void;
};

const DownloadContext = createContext<DownloadContextType | undefined>(undefined);

export const DownloadProvider = ({ children }: { children: ReactNode }) => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [activeQueue, setActiveQueue] = useState<ActiveDownload[]>([]);

  // Load history from local file on mount
  useEffect(() => {
    const initHistory = async () => {
      const history = await loadHistory();
      setDownloads(history);
    };
    initHistory();
  }, []);

  const addDownload = async (item: DownloadItem) => {
    setDownloads(prev => [item, ...prev]);
    await addHistoryItem(item);
  };

  const removeDownload = async (id: string) => {
    const item = downloads.find(d => d.id === id);
    if (item) {
      try {
        await deleteFile(item.localPath);
      } catch (e) {
        console.log('Error deleting file:', e);
      }
    }
    setDownloads(prev => prev.filter(d => d.id !== id));
    await removeHistoryItem(id);
  };

  const clearDownloads = async () => {
    for (const d of downloads) {
      try {
        await deleteFile(d.localPath);
      } catch (e) {
        console.log('Error deleting file:', e);
      }
    }
    setDownloads([]);
    await clearHistory();
  };

  const startDownloadJob = async (id: string, downloadUrl: string, localPath: string) => {
    try {
      let activeJobId: number | null = null;

      const downloadResult = RNFS.downloadFile({
        fromUrl: downloadUrl,
        toFile: localPath,
        background: true,
        progressInterval: 200,
        begin: (res) => {
          activeJobId = res.jobId;
          setActiveQueue(prev =>
            prev.map(d => (d.id === id ? { ...d, downloadJobId: res.jobId, status: 'downloading' } : d))
          );
        },
        progress: (res) => {
          if (res.contentLength > 0) {
            const percent = Math.round((res.bytesWritten / res.contentLength) * 100);
            setActiveQueue(prev =>
              prev.map(d => (d.id === id ? { ...d, progress: percent } : d))
            );
          }
        },
      });

      const result = await downloadResult.promise;

      if (result.statusCode === 200) {
        setActiveQueue(prev => {
          const completedItem = prev.find(d => d.id === id);
          if (completedItem) {
            const historyItem: DownloadItem = {
              id: completedItem.id,
              url: completedItem.url,
              localPath: completedItem.localPath,
              title: completedItem.title,
              thumbnail: completedItem.thumbnail,
              author: completedItem.author,
              duration: completedItem.duration,
              createdAt: new Date().toISOString(),
              fileSize: completedItem.fileSize,
              resolution: completedItem.selectedQuality,
            };

            // Save history
            setDownloads(prevHistory => [historyItem, ...prevHistory]);
            addHistoryItem(historyItem);
            
            // Show interstitial ad (ad frequency check)
            trackDownloadForAd(false);
          }
          // Remove from active queue
          return prev.filter(d => d.id !== id);
        });
      } else {
        throw new Error(`Server returned status code ${result.statusCode}`);
      }
    } catch (error: any) {
      setActiveQueue(prev => {
        const item = prev.find(d => d.id === id);
        if (item && item.status === 'cancelled') {
          return prev.filter(d => d.id !== id);
        }
        return prev.map(d => (d.id === id ? { ...d, status: 'failed', downloadJobId: null } : d));
      });
      console.log('Download error:', error);
    }
  };

  const addToQueue = async (
    url: string,
    directUrl: string,
    title: string,
    thumbnail: string,
    author: string,
    duration: number,
    quality: string,
    size: string
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    const fileName = `${cleanTitle || 'video'}_${Date.now()}.mp4`;
    
    await ensureAppDir();
    const localPath = `${APP_DOWNLOAD_DIR}/${fileName}`;

    const newDownload: ActiveDownload = {
      id,
      url,
      downloadUrl: directUrl,
      title,
      thumbnail,
      author,
      duration,
      progress: 0,
      status: 'queued',
      downloadJobId: null,
      localPath,
      selectedQuality: quality,
      fileSize: size,
    };

    setActiveQueue(prev => [...prev, newDownload]);
    
    // Start download asynchronously
    startDownloadJob(id, directUrl, localPath);
  };

  const pauseDownload = (id: string) => {
    setActiveQueue(prev => {
      const item = prev.find(d => d.id === id);
      if (item && item.downloadJobId !== null) {
        try {
          RNFS.stopDownload(item.downloadJobId);
        } catch (e) {
          console.log('Error stopping download:', e);
        }
        return prev.map(d => (d.id === id ? { ...d, status: 'paused', downloadJobId: null } : d));
      }
      return prev;
    });
  };

  const resumeDownload = (id: string) => {
    setActiveQueue(prev => {
      const item = prev.find(d => d.id === id);
      if (item && item.status === 'paused') {
        startDownloadJob(id, item.downloadUrl, item.localPath);
        return prev.map(d => (d.id === id ? { ...d, status: 'downloading' } : d));
      }
      return prev;
    });
  };

  const cancelDownload = (id: string) => {
    setActiveQueue(prev => {
      const item = prev.find(d => d.id === id);
      if (item) {
        if (item.downloadJobId !== null) {
          try {
            RNFS.stopDownload(item.downloadJobId);
          } catch (e) {
            console.log('Error stopping download:', e);
          }
        }
        
        // Remove partial files
        deleteFile(item.localPath).catch(err => console.log('Error deleting temp file:', err));
        
        // Remove from active queue
        return prev.filter(d => d.id !== id);
      }
      return prev;
    });
  };

  return (
    <DownloadContext.Provider
      value={{
        downloads,
        activeQueue,
        addDownload,
        removeDownload,
        clearDownloads,
        addToQueue,
        pauseDownload,
        resumeDownload,
        cancelDownload,
      }}
    >
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

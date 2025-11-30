// src/hooks/useDownloads.ts
import { useDownloadContext } from '../context/DownloadContext';

export const useDownloads = () => {
  const { downloads, addDownload, removeDownload, clearDownloads } = useDownloadContext();
  return { downloads, addDownload, removeDownload, clearDownloads };
};

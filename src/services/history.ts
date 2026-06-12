// src/services/history.ts
import RNFS from 'react-native-fs';

export type DownloadItem = {
  id: string;
  url: string;
  localPath: string;
  title: string;
  thumbnail: string;
  author: string;
  duration: number;
  createdAt: string;
  fileSize?: string;
  resolution?: string;
};

const HISTORY_FILE_PATH = `${RNFS.DocumentDirectoryPath}/history.json`;

export const loadHistory = async (): Promise<DownloadItem[]> => {
  try {
    const exists = await RNFS.exists(HISTORY_FILE_PATH);
    if (!exists) return [];
    const content = await RNFS.readFile(HISTORY_FILE_PATH, 'utf8');
    return JSON.parse(content) || [];
  } catch (error) {
    console.error('Failed to load download history:', error);
    return [];
  }
};

export const saveHistory = async (items: DownloadItem[]): Promise<void> => {
  try {
    await RNFS.writeFile(HISTORY_FILE_PATH, JSON.stringify(items, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to save download history:', error);
  }
};

export const addHistoryItem = async (item: DownloadItem): Promise<void> => {
  const history = await loadHistory();
  const filtered = history.filter(i => i.id !== item.id);
  await saveHistory([item, ...filtered]);
};

export const removeHistoryItem = async (id: string): Promise<void> => {
  const history = await loadHistory();
  const filtered = history.filter(i => i.id !== id);
  await saveHistory(filtered);
};

export const clearHistory = async (): Promise<void> => {
  await saveHistory([]);
};

// src/services/fileSystem.ts
import RNFS from 'react-native-fs';

export const APP_DOWNLOAD_DIR = `${RNFS.DownloadDirectoryPath}/SocialSaver`;

export const ensureAppDir = async () => {
  const exists = await RNFS.exists(APP_DOWNLOAD_DIR);
  if (!exists) {
    await RNFS.mkdir(APP_DOWNLOAD_DIR);
  }
};

export const WHATSAPP_STATUS_PATHS = [
  '/storage/emulated/0/WhatsApp/Media/.Statuses',
  '/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/.Statuses',
];

export const getStatusFiles = async () => {
  for (const path of WHATSAPP_STATUS_PATHS) {
    const exists = await RNFS.exists(path);
    if (exists) {
      try {
        const files = await RNFS.readDir(path);
        return files.filter(f => f.isFile());
      } catch (e) {
        console.log('Error reading status dir', e);
      }
    }
  }
  return [];
};

export const saveStatusFile = async (sourcePath: string) => {
  await ensureAppDir();
  const fileName = sourcePath.split('/').pop() || `status_${Date.now()}.jpg`;
  const destPath = `${APP_DOWNLOAD_DIR}/${fileName}`;
  await RNFS.copyFile(sourcePath, destPath);
  return destPath;
};

export const getDownloadedFiles = async () => {
  await ensureAppDir();
  const files = await RNFS.readDir(APP_DOWNLOAD_DIR);
  return files.filter(f => f.isFile());
};

export const deleteFile = async (path: string) => {
  const exists = await RNFS.exists(path);
  if (exists) {
    await RNFS.unlink(path);
  }
};

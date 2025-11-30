// src/services/download.ts
import RNFS from 'react-native-fs';
import { apiDownload } from './api';
import { ensureAppDir, APP_DOWNLOAD_DIR } from './fileSystem';

export const downloadFromUrl = async (url: string) => {
  await ensureAppDir();

  const { downloadUrl, fileName, title, duration } = await apiDownload(url);

  const localFilePath = `${APP_DOWNLOAD_DIR}/${fileName}`;

  const result = await RNFS.downloadFile({
    fromUrl: downloadUrl,
    toFile: localFilePath,
    title,
    duration,
  }).promise;

  if (result.statusCode !== 200) {
    throw new Error('File download failed');
  }

  return {
    url,
    localPath: localFilePath,
  };
};

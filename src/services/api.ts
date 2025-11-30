// src/services/api.ts
export type DownloadApiResponse = {
  success: boolean;
  platform: string;
  downloadUrl: string;
  fileName: string;
  title: string;
  duration?: number;
};

// Change BASE_URL to your backend URL
// For emulator Android use 10.0.2.2 if local, or Render hosted URL later
const BASE_URL = 'https://unreinstated-nidia-unafflicting.ngrok-free.dev'; //

export const apiDownload = async (
  url: string,
): Promise<DownloadApiResponse> => {
  const response = await fetch(`${BASE_URL}/download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error('API failed. Unable to download.');
  }

  const data = await response.json();

  if (!data.success || !data.downloadUrl) {
    throw new Error('Invalid video URL or unsupported format');
  }

  return {
    success: data.success,
    platform: data.platform,
    downloadUrl: data.downloadUrl,
    fileName: data.fileName,
  };
};

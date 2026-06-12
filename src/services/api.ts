// src/services/api.ts
export type DownloadApiResponse = {
  success: boolean;
  platform: string;
  downloadUrl: string;
  fileName: string;
  title: string;
  thumbnail?: string;
  author?: string;
  duration?: number;
};

export const apiDownload = async (
  url: string,
): Promise<DownloadApiResponse> => {
  const host = 'instagram-reels-downloader-api.p.rapidapi.com';
  const apiKey = '5735b1b03dmsh9c0fe2b9f1079bap1a8231jsnbb2cf679d776';

  console.log('🌐 Calling RapidAPI directly from the frontend...');
  const response = await fetch(
    `https://${host}/download?url=${encodeURIComponent(url)}`,
    {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': host,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`API failed with status ${response.status}. Unable to download.`);
  }

  const result = await response.json();
  const mediaData = result?.data;
  const videoUrl = mediaData?.medias?.[0]?.url;
  const shortcode = mediaData?.shortcode || 'video';

  if (!videoUrl) {
    throw new Error('Invalid video URL or unsupported format');
  }

  return {
    success: true,
    platform: 'instagram',
    downloadUrl: videoUrl,
    fileName: `${shortcode}.mp4`,
    title: mediaData?.title || 'Instagram Video',
    thumbnail: mediaData?.thumbnail || '',
    author: mediaData?.author || 'Instagram Creator',
    duration: mediaData?.duration || 0,
  };
};

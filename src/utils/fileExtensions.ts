import { SUPPORTED_AUDIO_EXTENSIONS, SUPPORTED_VIDEO_EXTENSIONS } from '@config';

export enum MediaType {
  Image,
  Video,
  Audio
}

export const detectMediaType = (url: string) => {
  const fileExtension = url.split('.').pop();
  if (fileExtension && SUPPORTED_VIDEO_EXTENSIONS.includes(fileExtension)) {
    return MediaType.Video;
  } else if (fileExtension && SUPPORTED_AUDIO_EXTENSIONS.includes(fileExtension)) {
    return MediaType.Audio;
  }

  return MediaType.Image;
};

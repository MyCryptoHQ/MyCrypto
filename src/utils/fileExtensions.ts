import { SUPPORTED_AUDIO_EXTENSIONS, SUPPORTED_VIDEO_EXTENSIONS } from '@config';

export enum MediaType {
  Image,
  Video,
  Audio
}

export const getFileExtension = (url: string) => {
  const split = url.split('.');
  return split.length > 1 ? split.pop() : undefined;
};

export const detectMediaType = (url: string) => {
  const fileExtension = getFileExtension(url);
  if (fileExtension && SUPPORTED_VIDEO_EXTENSIONS.includes(fileExtension)) {
    return MediaType.Video;
  } else if (fileExtension && SUPPORTED_AUDIO_EXTENSIONS.includes(fileExtension)) {
    return MediaType.Audio;
  }

  return MediaType.Image;
};

import { TURL } from '@types';

export interface ReleaseURLs {
  [key: string]: TURL;
}

export interface ReleaseInfo {
  name: string;
  version: string;
  releaseUrls: ReleaseURLs;
}

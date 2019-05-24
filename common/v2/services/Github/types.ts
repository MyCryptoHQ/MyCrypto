export interface ReleaseURLs {
  [key: string]: string;
}

export interface ReleaseInfo {
  name: string;
  version: string;
  releaseUrls: ReleaseURLs;
}

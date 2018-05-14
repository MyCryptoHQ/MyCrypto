interface Author {
  login: string;
  id: number;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

interface Uploader {
  login: string;
  id: number;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

interface Asset {
  url: string;
  id: number;
  name: string;
  label?: any;
  uploader: Uploader;
  content_type: string;
  state: string;
  size: number;
  download_count: number;
  created_at: Date;
  updated_at: Date;
  browser_download_url: string;
}

export interface Releases {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  author: Author;
  prerelease: boolean;
  created_at: Date;
  published_at: Date;
  assets: Asset[];
  tarball_url: string;
  zipball_url: string;
  body: string;
}

export enum Platforms {
  MAC = 'mac',
  WINDOWS = 'windows',
  LINUX_i386 = 'linux-i386',
  LINUX_x86 = 'linux-x86-64'
}

export type Name = 'MyCrypto';

export type VersionNumber = string;

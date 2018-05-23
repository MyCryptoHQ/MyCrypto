export interface Creator {
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

export interface CommitStatus {
  url: string;
  id: number;
  state: string;
  description: string;
  target_url: string;
  context: string;
  created_at: Date;
  updated_at: Date;
  creator: Creator;
}

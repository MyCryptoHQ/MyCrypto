export enum Social {
  TELEGRAM = 'telegram',
  TWITTER = 'twitter',
  REDDIT = 'reddit',
  GITHUB = 'github',
  FACEBOOK = 'facebook',
  SLACK = 'slack',
  CMC = 'cmc'
}

export type AssetSocial = {
  [key in Social]?: string;
};

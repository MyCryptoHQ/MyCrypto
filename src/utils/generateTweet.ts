import { TWEET_LINK } from '@config';

export const generateTweet = (content: string) => `${TWEET_LINK}${encodeURIComponent(content)}`;

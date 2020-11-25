import React, { useContext } from 'react';

import { StoreContext } from '@services';
import { translateRaw } from '@translations';
import { ExtendedUserAction } from '@types';
import { generateTweet } from '@utils';

import { ActionButton } from './ActionButton';

export interface TweetButtonProps {
  userAction: ExtendedUserAction;
}

export const TweetButton = ({ userAction }: TweetButtonProps) => {
  const { memberships } = useContext(StoreContext);

  const to = generateTweet(
    translateRaw('MYC_WINTER_BONUS_TWEET', {
      $address: memberships![0].address
    })
  );
  return (
    <ActionButton
      content={translateRaw('MYC_WINTER_BONUS_ACTION_BUTTON')}
      shouldComplete={true}
      to={to}
      external={true}
      userAction={userAction}
    />
  );
};

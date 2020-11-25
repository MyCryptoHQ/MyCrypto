import React from 'react';

import { useHistory } from 'react-router-dom';

import { Button } from '@components';
import { useUserActions } from '@services';
import { ACTION_STATE, ExtendedUserAction, TURL } from '@types';
import { openLink } from '@utils';

export interface ActionButtonProps {
  userAction: ExtendedUserAction;
  content: string;
  to: string;
  shouldComplete?: boolean;
  external: boolean;
}

export const ActionButton = ({
  content,
  to,
  shouldComplete,
  external,
  userAction
}: ActionButtonProps) => {
  const { updateUserAction } = useUserActions();
  const history = useHistory();

  const handleClick = () => {
    updateUserAction(userAction.uuid, {
      ...userAction,
      state: shouldComplete ? ACTION_STATE.COMPLETED : ACTION_STATE.STARTED
    });
    external ? openLink(to as TURL) : history.push(to);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={userAction.state != 'default' && userAction.state === 'completed'}
      fullwidth={true}
    >
      {content}
    </Button>
  );
};

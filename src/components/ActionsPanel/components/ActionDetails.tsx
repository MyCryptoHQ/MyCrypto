import React from 'react';

import { useHistory } from 'react-router-dom';

import { Button } from '@components';
import Box from '@components/Box';
import { Body } from '@components/NewTypography';
import { useUserActions } from '@services';
import { SPACING } from '@theme';
import { ActionTemplate } from '@types';

export const ActionDetails = ({ actionTemplate }: { actionTemplate: ActionTemplate }) => {
  const { updateUserAction, userActions } = useUserActions();
  const history = useHistory();

  const userAction = userActions.find((el) => el.name === actionTemplate.name)!;

  const handleClick = () => {
    userAction.state != 'default' &&
      updateUserAction(userAction.uuid, { ...userAction, state: 'started' });
    actionTemplate.button.external
      ? window.open(actionTemplate.button.to, '_blank', 'nopperer noreferer')
      : history.push(actionTemplate.button.to);
  };
  return (
    <Box px={SPACING.BASE} mb={SPACING.BASE}>
      {actionTemplate.body.map((item, i) => (
        <Body key={i}>{item}</Body>
      ))}
      {actionTemplate.component && actionTemplate.component()}
      <Button
        onClick={handleClick}
        disabled={userAction.state != 'default' && userAction.state === 'completed'}
        fullwidth={true}
      >
        {actionTemplate.button.content}
      </Button>
    </Box>
  );
};

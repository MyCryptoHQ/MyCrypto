import { useEffect } from 'react';

import styled from 'styled-components';

import Box from '@components/Box';
import { Body } from '@components/NewTypography';
import { useUserActions } from '@services';
import { SPACING } from '@theme';
import { ACTION_STATE, ActionTemplate } from '@types';

const SBox = styled(Box)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  & > * {
    margin-bottom: ${SPACING.BASE};
  }
  & ol {
    margin: 0;
  }
  & li {
    list-style-position: inside;
    font-weight: 400;
    margin: 0;
  }
`;

const SBody = styled(Body)`
  text-align: center;
`;

export const ActionDetails = ({ actionTemplate }: { actionTemplate: ActionTemplate }) => {
  const { findUserAction, updateUserAction } = useUserActions();

  const userAction = findUserAction(actionTemplate.name)!;

  useEffect(() => {
    if (userAction.state === ACTION_STATE.NEW) {
      updateUserAction(userAction.uuid, {
        ...userAction,
        state: ACTION_STATE.VIEWED
      });
    }
  }, [userAction]);

  const Component = actionTemplate.Component;

  const ButtonComponent = actionTemplate.button.component;

  return (
    <Box
      px={SPACING.BASE}
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <SBox>
        {actionTemplate.body && actionTemplate.body.map((item, i) => <SBody key={i}>{item}</SBody>)}
        {Component && <Component {...actionTemplate.props} />}
      </SBox>
      <Box mb={SPACING.BASE}>
        <ButtonComponent {...actionTemplate.button.props} userAction={userAction} />
      </Box>
    </Box>
  );
};

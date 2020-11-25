import React from 'react';

import styled from 'styled-components';

import Box from '@components/Box';
import { Body } from '@components/NewTypography';
import { useUserActions } from '@services';
import { SPACING } from '@theme';
import { ActionTemplate } from '@types';

const SBox = styled(Box)`
  & > * {
    margin-bottom: ${SPACING.BASE};
  }
`;

export const ActionDetails = ({ actionTemplate }: { actionTemplate: ActionTemplate }) => {
  const { findUserAction } = useUserActions();

  const userAction = findUserAction(actionTemplate.name)!;

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
        {actionTemplate.body && actionTemplate.body.map((item, i) => <Body key={i}>{item}</Body>)}
        {Component && <Component {...actionTemplate.props} />}
      </SBox>
      <Box mb={SPACING.BASE}>
        <ButtonComponent {...actionTemplate.button.props} userAction={userAction} />
      </Box>
    </Box>
  );
};

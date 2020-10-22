import React, { Dispatch, SetStateAction } from 'react';

import styled, { css, keyframes } from 'styled-components';

import Icon from '@components/Icon';
import { Text } from '@components/NewTypography';
import { useUserActions } from '@services';
import { COLORS, SPACING } from '@theme';
import { ActionTemplate } from '@types';

const greenLightup = keyframes`
  0% {
    background-color: white;
  }
  50% {
    background-color: ${COLORS.LIGHT_GREEN};
  }
  100% {
    background-color: white;
  }
`;

const Action = styled.div<{ state?: string }>`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${COLORS.GREY_ATHENS};
  min-height: 80px;
  padding: 0 ${SPACING.BASE};
  cursor: pointer;
  ${(p) =>
    p.state === 'completed' &&
    css`
      & > * {
        opacity: 0.2;
      }
      text-decoration: line-through;
    `}
  ${(p) =>
    !p.state &&
    css`
      animation: ${greenLightup} 1.5s ease-in-out;
    `}
`;

const IconContainer = styled.div`
  & > * {
    vertical-align: middle;
  }
  text-align: center;
  width: 28px;
  height: 28px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 0 ${SPACING.BASE};
`;

export const ActionItem = ({
  actionTemplate,
  onActionClick
}: {
  actionTemplate: ActionTemplate;
  onActionClick: Dispatch<SetStateAction<ActionTemplate | undefined>>;
}) => {
  const { findUserAction, createUserAction } = useUserActions();

  const userAction = findUserAction(actionTemplate.name);

  if (!userAction) createUserAction(actionTemplate);

  const SubHeading = actionTemplate.subHeading;

  return (
    <Action state={userAction && userAction.state} onClick={() => onActionClick(actionTemplate)}>
      <IconContainer>
        <Icon type={actionTemplate.icon} height="28px" />
      </IconContainer>
      <TitleContainer>
        <Text mb={0} fontSize={2}>
          {actionTemplate.heading}
        </Text>
        {SubHeading && <SubHeading {...actionTemplate.props} />}
      </TitleContainer>
      <Icon type="more" />
    </Action>
  );
};

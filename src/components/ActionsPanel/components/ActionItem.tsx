import { Dispatch, SetStateAction } from 'react';

import styled, { css, keyframes } from 'styled-components';

import Icon from '@components/Icon';
import { Text } from '@components/NewTypography';
import { useUserActions } from '@services';
import { COLORS, SPACING } from '@theme';
import { ACTION_STATE, ActionTemplate } from '@types';

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
  ${(p) =>
    css`
      background: ${!p.state || p.state === 'new' ? COLORS.WHITE : 'rgba(232, 234, 237, 0.3)'};
    `}
  border-bottom: 1px solid ${COLORS.GREY_ATHENS};
  min-height: 60px;
  padding: 0 ${SPACING.BASE};
  cursor: pointer;
  ${(p) =>
    p.state === 'completed' &&
    css`
      & > div {
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
  onActionClick,
  hidden = false
}: {
  actionTemplate: ActionTemplate;
  onActionClick?: Dispatch<SetStateAction<ActionTemplate | undefined>>;
  hidden?: boolean;
}) => {
  const { findUserAction, createUserAction, updateUserAction } = useUserActions();

  const userAction = findUserAction(actionTemplate.name);

  if (!userAction) createUserAction(actionTemplate);

  const isNew = !userAction || userAction.state === ACTION_STATE.NEW;

  const SubHeading = actionTemplate.subHeading;

  return (
    <Action
      state={userAction && userAction.state}
      onClick={() => !hidden && onActionClick && onActionClick(actionTemplate)}
    >
      <IconContainer>
        <Icon type={actionTemplate.icon} height="28px" />
      </IconContainer>
      <TitleContainer>
        <Text mb={0} fontSize={2} fontWeight={isNew ? 'bold' : undefined}>
          {actionTemplate.heading}
        </Text>
        {SubHeading && <SubHeading {...actionTemplate.props} />}
      </TitleContainer>

      <Icon
        type={
          hidden
            ? 'opened-eye'
            : userAction && userAction.state === 'completed'
            ? 'action-completed'
            : 'more'
        }
        onClick={() =>
          hidden &&
          userAction &&
          updateUserAction(userAction.uuid, { ...userAction, state: ACTION_STATE.NEW })
        }
        height={hidden ? '18px' : '24px'}
      />
    </Action>
  );
};

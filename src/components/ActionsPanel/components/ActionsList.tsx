import React, { Dispatch, SetStateAction, useState } from 'react';

import styled from 'styled-components';

import IconArrow from '@components/IconArrow';
import { Text } from '@components/NewTypography';
import { useUserActions } from '@services';
import { COLORS, SPACING } from '@theme';
import { translateRaw } from '@translations';
import { ACTION_STATE, ActionTemplate } from '@types';
import { descend, filter, flatten, groupBy, pipe, prop, sort, union, values } from '@vendor';

import { ActionItem } from './ActionItem';

interface ActionsListProps {
  actionTemplates: ActionTemplate[];
  onActionClick: Dispatch<SetStateAction<ActionTemplate | undefined>>;
}

const ActionsContainer = styled.div`
  height: 400px;
  overflow-y: scroll;
`;

const DismissedButton = styled.div`
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${COLORS.GREY_ATHENS};
  padding: 0 ${SPACING.BASE};
  cursor: pointer;
`;

const category = prop('category');

export const sortActions: (actionTemplates: ActionTemplate[]) => ActionTemplate[] = pipe(
  groupBy<ActionTemplate>(category),
  values,
  flatten,
  sort(descend(prop('priority')))
);

export const ActionsList = ({ actionTemplates, onActionClick }: ActionsListProps) => {
  const { findUserAction } = useUserActions();
  const [showHidden, setShowHidden] = useState<boolean>(false);

  const byState = (a: ActionTemplate, state: ACTION_STATE) => {
    const userAction = findUserAction(a.name);
    if (userAction && userAction.state === state) return true;
    return false;
  };

  const visibleActions = filter((a: ActionTemplate) => !byState(a, ACTION_STATE.HIDDEN))(
    actionTemplates
  );

  const sortedActions = pipe(
    filter((a: ActionTemplate) => !byState(a, ACTION_STATE.COMPLETED)),
    sortActions
  )(visibleActions);

  const actions = union(sortedActions, visibleActions);

  const hiddenActions = filter((a: ActionTemplate) => byState(a, ACTION_STATE.HIDDEN))(
    actionTemplates
  );

  return (
    <ActionsContainer>
      {actions.map((action: ActionTemplate, i) => (
        <ActionItem key={i} actionTemplate={action} onActionClick={onActionClick} />
      ))}
      <DismissedButton onClick={() => setShowHidden(!showHidden)}>
        <Text mb={0} fontSize={2}>
          {translateRaw('ACTIONS_LIST_SHOW_HIDDEN')}
        </Text>
        <IconArrow isFlipped={showHidden} fillColor={COLORS.BLUE_BRIGHT} size={'lg'} />
      </DismissedButton>
      {showHidden &&
        hiddenActions.map((action: ActionTemplate, i) => (
          <ActionItem key={i} actionTemplate={action} hidden={true} />
        ))}
    </ActionsContainer>
  );
};

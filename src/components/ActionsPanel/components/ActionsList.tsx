import { Dispatch, SetStateAction, useState } from 'react';

import styled from 'styled-components';

import { Box, Icon, Text } from '@components';
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

const DismissedButton = styled.div`
  height: ${SPACING.XL};
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
    <>
      <Box maxHeight={{ md: '180px' }} overflowY="auto">
        {actions.map((action: ActionTemplate, i) => (
          <ActionItem key={i} actionTemplate={action} onActionClick={onActionClick} />
        ))}
      </Box>
      <DismissedButton onClick={() => setShowHidden(!showHidden)}>
        <Text mb={0} fontSize={2}>
          {translateRaw('ACTIONS_LIST_SHOW_HIDDEN')}
        </Text>
        <Icon type="expandable" isExpanded={showHidden} height="1em" fill="linkAction" />
      </DismissedButton>
      {showHidden && (
        <Box maxHeight="240px" overflowY="auto">
          {hiddenActions.map((action: ActionTemplate, i) => (
            <ActionItem key={i} actionTemplate={action} hidden={true} />
          ))}
        </Box>
      )}
    </>
  );
};

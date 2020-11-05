import React, { Dispatch, SetStateAction } from 'react';

import styled from 'styled-components';

import { useUserActions } from '@services';
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

const category = prop('category');

export const sortActions: (actionTemplates: ActionTemplate[]) => ActionTemplate[] = pipe(
  groupBy<ActionTemplate>(category),
  values,
  flatten,
  sort(descend(prop('priority')))
);

export const ActionsList = ({ actionTemplates, onActionClick }: ActionsListProps) => {
  const { findUserAction } = useUserActions();

  const isCompleted = (a: ActionTemplate) => {
    const userAction = findUserAction(a.name);
    if (userAction && userAction.state === ACTION_STATE.COMPLETED) return false;
    return true;
  };

  const sortedActions = pipe(filter(isCompleted), sortActions)(actionTemplates);
  const actions = union(sortedActions, actionTemplates);

  return (
    <ActionsContainer>
      {actions.map((action: ActionTemplate, i) => (
        <ActionItem key={i} actionTemplate={action} onActionClick={onActionClick} />
      ))}
    </ActionsContainer>
  );
};

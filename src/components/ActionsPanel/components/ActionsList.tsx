import React, { Dispatch, SetStateAction } from 'react';

import styled from 'styled-components';

import { ActionTemplate } from '@types';
import {
  descend,
  flatten,
  groupBy,
  ifElse,
  last,
  map,
  pipe,
  prop,
  sort,
  sortBy,
  union,
  values
} from '@vendor';

import { ActionItem } from './ActionItem';

interface ActionsListProps {
  actionTemplates: ActionTemplate[];
  onActionClick: Dispatch<SetStateAction<ActionTemplate | undefined>>;
}

const ActionsContainer = styled.div`
  height: 400px;
  overflow-y: scroll;
`;

export const areSamePriority = (actionTemplates: ActionTemplate[]) => {
  const firstPriority = actionTemplates[0].priority;
  for (const userAction of actionTemplates) {
    if (userAction.priority !== firstPriority) return false;
  }
  return true;
};

const category = prop('category');

const selectHighestPriorityAction = pipe(sortBy(category), last);

export const selectActionToDisplay = ifElse(areSamePriority, last, selectHighestPriorityAction);

export const getFeaturedActions: (actionTemplates: ActionTemplate[]) => ActionTemplate[] = pipe(
  groupBy<ActionTemplate>(category),
  // @ts-expect-error ramda types don't understand received variables as an iterable.
  map<ActionTemplate, ActionTemplate>(selectActionToDisplay),
  values,
  flatten,
  sort(descend(prop('priority')))
);

export const ActionsList = ({ actionTemplates, onActionClick }: ActionsListProps) => {
  const featuredActions = getFeaturedActions(actionTemplates);
  const actions = union(featuredActions, actionTemplates);

  return (
    <ActionsContainer>
      {actions.map((action: ActionTemplate, i) => (
        <ActionItem key={i} actionTemplate={action} onActionClick={onActionClick} />
      ))}
    </ActionsContainer>
  );
};

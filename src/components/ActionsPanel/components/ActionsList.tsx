import React, { Dispatch, SetStateAction } from 'react';

import styled from 'styled-components';

import { ACTION_CATEGORIES, ActionTemplate } from '@types';

import { ActionItem } from './ActionItem';

interface ActionsListProps {
  actionTemplates: ActionTemplate[];
  onActionClick: Dispatch<SetStateAction<ActionTemplate | undefined>>;
}

const ActionsContainer = styled.div`
  height: 300px;
  overflow-y: scroll;
`;

export const ActionsList = ({ actionTemplates, onActionClick }: ActionsListProps) => {
  const areSamePriority = (actionTemplates: ActionTemplate[]) => {
    const firstPriority = actionTemplates[0].priority;
    for (const userAction of actionTemplates) {
      if (userAction.priority !== firstPriority) return false;
    }
    return true;
  };

  const getTopOfCategory = (actionTemplates: ActionTemplate[], category: ACTION_CATEGORIES) => {
    const actionsOfCategory = actionTemplates.filter(
      (actionTemplate) => actionTemplate.category === category
    );
    if (actionsOfCategory.length)
      return areSamePriority(actionsOfCategory)
        ? actionsOfCategory[Math.floor(Math.random() * actionsOfCategory.length)]
        : actionsOfCategory.sort((a, b) => a.priority - b.priority)[0];
  };

  const getFeaturedActions = (actionTemplates: ActionTemplate[]) => {
    const bestOfCategories = [] as ActionTemplate[];
    for (const categorie in ACTION_CATEGORIES) {
      const topOfCategory = getTopOfCategory(actionTemplates, categorie as ACTION_CATEGORIES);
      topOfCategory && bestOfCategories.push(topOfCategory);
    }

    return bestOfCategories;
  };

  const sortActions = (actionsList: ActionTemplate[], bestOfCategories: ActionTemplate[]) => {
    let sortedActions = actionsList;

    bestOfCategories.forEach((el) => {
      sortedActions = sortedActions.filter((action) => action != el);
    });

    return sortedActions;
  };

  const featuredActions = getFeaturedActions(actionTemplates);

  const sortedActions = sortActions(actionTemplates, featuredActions);

  return (
    <ActionsContainer>
      {featuredActions.map((action: ActionTemplate, i) => (
        <ActionItem key={i} actionTemplate={action} onActionClick={onActionClick} />
      ))}
      {sortedActions.map((action: ActionTemplate, i) => (
        <ActionItem key={i} actionTemplate={action} onActionClick={onActionClick} />
      ))}
    </ActionsContainer>
  );
};

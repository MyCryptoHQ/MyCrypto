import React, { useContext, useMemo, useState } from 'react';

import styled from 'styled-components';

import { DashboardPanel } from '@components';
import Icon from '@components/Icon';
import { useUserActions } from '@services';
import { StoreContext, State as StoreContextState } from '@services/Store/StoreProvider';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
import { Trans } from '@translations';
import { ACTION_STATE, ActionTemplate } from '@types';

import { Text } from '../NewTypography';
import { ActionDetails, ActionsList } from './components';
import { actionTemplates } from './constants';

const SDashboardPanel = styled(DashboardPanel)`
  min-height: 384px;
`;

const DetailsHeading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const SIcon = styled(Icon)`
  cursor: pointer;
`;

const HeadingText = styled.span`
  margin: 0;
  font-size: ${FONT_SIZE.XL};
  font-weight: bold;
  color: ${COLORS.BLUE_DARK_SLATE};
  margin-left: ${SPACING.BASE};
  width: 250px;
`;

const filterUserActions = (actionTemplates: ActionTemplate[], state: StoreContextState) =>
  actionTemplates.filter((action) => {
    const filter = action.filter;
    if (!filter) return true;
    return filter(state);
  });

export const ActionPanel = () => {
  const storeContextState = useContext(StoreContext);
  const { userActions, updateUserAction, findUserAction } = useUserActions();
  const [currentAction, setCurrentAction] = useState<ActionTemplate | undefined>();

  const relevantActions = useMemo(() => filterUserActions(actionTemplates, storeContextState), [
    storeContextState
  ]);

  const dismiss = () => {
    const userAction = findUserAction(currentAction!.name)!;
    updateUserAction(userAction.uuid, { ...userAction, state: ACTION_STATE.HIDDEN });
    setCurrentAction(undefined);
  };

  return (
    <SDashboardPanel
      heading={
        currentAction ? (
          <SIcon type="back" width={20} onClick={() => setCurrentAction(undefined)} />
        ) : (
          <Trans id="ACTION_PANEL_HEADING" />
        )
      }
      headingRight={
        currentAction ? (
          <DetailsHeading>
            <Icon width={20} type={currentAction.icon} />
            <HeadingText>{currentAction.heading}</HeadingText>
            <SIcon width={20} type="closed-eye" onClick={dismiss} />
          </DetailsHeading>
        ) : (
          <Text color="GREY" fontSize={0} mb={0}>
            <Trans
              id="ACTION_PANEL_COMPLETED_COUNT"
              variables={{
                $number: () => userActions.filter((a) => a.state === 'completed').length,
                $total: () =>
                  relevantActions.filter((a: ActionTemplate) => {
                    const userAction = findUserAction(a.name);
                    if (!userAction) return true;
                    else if (userAction && userAction.state !== ACTION_STATE.HIDDEN) return true;
                    else return false;
                  }).length
              }}
            />
          </Text>
        )
      }
    >
      {currentAction ? (
        <ActionDetails actionTemplate={currentAction} />
      ) : (
        <ActionsList actionTemplates={relevantActions} onActionClick={setCurrentAction} />
      )}
    </SDashboardPanel>
  );
};

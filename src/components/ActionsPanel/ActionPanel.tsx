import React, { useContext, useEffect, useMemo, useState } from 'react';

import styled from 'styled-components';

import { DashboardPanel } from '@components';
import Icon from '@components/Icon';
import { useTxHistory, useUserActions } from '@services';
import { StoreContext } from '@services/Store/StoreProvider';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
import { Trans } from '@translations';
import {
  ACTION_NAME,
  ACTION_STATE,
  ActionFilters,
  ActionTemplate,
  ExtendedUserAction,
  ITxType
} from '@types';
import { dateIsBetween } from '@utils';
import { filter, pipe } from '@vendor';

import { Text } from '../NewTypography';
import { ActionDetails, ActionsList } from './components';
import { actionTemplates } from './constants';

const SDashboardPanel = styled(DashboardPanel)`
  min-height: 280px;
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
  font-size: ${FONT_SIZE.XL};
  font-weight: bold;
  color: ${COLORS.BLUE_DARK_SLATE};
  margin: 0 ${SPACING.BASE};
`;

const filterUserActions = (
  actionTemplates: ActionTemplate[],
  filters: ActionFilters,
  findUserAction: (name: ACTION_NAME) => ExtendedUserAction | undefined
) =>
  actionTemplates.filter((action) => {
    const userAction = findUserAction(action.name);
    // Always show completed actions
    if (userAction && userAction.state === ACTION_STATE.COMPLETED) return true;
    const filter = action.filter;
    if (!filter) return true;
    return filter(filters);
  });

// @todo Move this somewhere where it makes sense
const MIGRATION_MAPPING: { [key: string]: ACTION_NAME } = {
  [ITxType.AAVE_TOKEN_MIGRATION]: ACTION_NAME.MIGRATE_LEND,
  [ITxType.ANT_TOKEN_MIGRATION]: ACTION_NAME.MIGRATE_ANT,
  [ITxType.REP_TOKEN_MIGRATION]: ACTION_NAME.MIGRATE_REP,
  [ITxType.GOLEM_TOKEN_MIGRATION]: ACTION_NAME.MIGRATE_GOL
};

export const ActionPanel = () => {
  const { assets, uniClaims, ensOwnershipRecords, accounts, isMyCryptoMember } = useContext(
    StoreContext
  );
  const { txHistory } = useTxHistory();
  const { userActions, updateUserAction, findUserAction } = useUserActions();
  const [currentAction, setCurrentAction] = useState<ActionTemplate | undefined>();

  // @todo Move this somewhere where it makes sense
  useEffect(() => {
    Object.entries(MIGRATION_MAPPING).forEach(([txType, actionType]) => {
      const action = findUserAction(actionType);
      if (action && txHistory.some((t) => t.txType === txType)) {
        updateUserAction(action.uuid, {
          ...action,
          state: ACTION_STATE.COMPLETED
        });
      }
    });
  }, [txHistory]);

  const relevantActions = useMemo(
    () =>
      pipe(
        (a: ActionTemplate[]) =>
          filterUserActions(
            a,
            {
              assets,
              uniClaims,
              ensOwnershipRecords,
              accounts,
              isMyCryptoMember
            },
            findUserAction
          ),
        filter((a: ActionTemplate) => (a.time ? dateIsBetween(a.time.start, a.time.end) : true))
      )(actionTemplates),
    [assets, uniClaims, ensOwnershipRecords, accounts, isMyCryptoMember]
  );

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

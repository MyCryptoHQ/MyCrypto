import { useMemo, useState } from 'react';

import styled from 'styled-components';

import { Box, DashboardPanel } from '@components';
import Icon from '@components/Icon';
import { useUserActions } from '@services';
import {
  getAccountsAssets,
  getAllClaims,
  getENSRecords,
  getIsMyCryptoMember,
  getStoreAccounts,
  useSelector
} from '@store';
import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from '@theme';
import { Trans } from '@translations';
import { ACTION_STATE, ActionFilters, ActionTemplate } from '@types';
import { dateIsBetween } from '@utils';
import { filter, pipe } from '@vendor';

import { Text } from '../NewTypography';
import { ActionDetails, ActionsList } from './components';
import { actionTemplates } from './constants';

const SDashboardPanel = styled(DashboardPanel)`
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    min-height: 280px;
  }
`;

const DetailsHeading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: center;
`;

const SIcon = styled(Icon)`
  cursor: pointer;
  min-width: 20px;
`;

const HeadingText = styled.span`
  font-size: ${FONT_SIZE.XL};
  font-weight: bold;
  color: ${COLORS.BLUE_DARK_SLATE};
  margin: 0 ${SPACING.BASE};
`;

const filterUserActions = (actionTemplates: ActionTemplate[], filters: ActionFilters) =>
  actionTemplates.filter((action) => {
    const filter = action.filter;
    if (!filter) return true;
    return filter(filters);
  });

export const ActionPanel = () => {
  const accounts = useSelector(getStoreAccounts);
  const assets = useSelector(getAccountsAssets);
  const isMyCryptoMember = useSelector(getIsMyCryptoMember);
  const claims = useSelector(getAllClaims);
  const ensOwnershipRecords = useSelector(getENSRecords);
  const { userActions, updateUserAction, findUserAction } = useUserActions();
  const [currentAction, setCurrentAction] = useState<ActionTemplate | undefined>();

  const relevantActions = useMemo(
    () =>
      pipe(
        (a: ActionTemplate[]) =>
          filterUserActions(a, {
            assets,
            claims,
            ensOwnershipRecords,
            accounts,
            isMyCryptoMember
          }),
        filter((a: ActionTemplate) => (a.time ? dateIsBetween(a.time.start, a.time.end) : true))
      )(actionTemplates),
    [assets, claims, ensOwnershipRecords, accounts, isMyCryptoMember]
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
          <Box variant="rowAlign">
            <SIcon type="back" width={20} onClick={() => setCurrentAction(undefined)} />
            <DetailsHeading>
              <Icon width={20} minWidth={20} marginX={SPACING.XS} type={currentAction.icon} />
              <HeadingText>{currentAction.heading}</HeadingText>
            </DetailsHeading>
            <SIcon width={20} type="closed-eye" onClick={dismiss} />
          </Box>
        ) : (
          <Trans id="ACTION_PANEL_HEADING" />
        )
      }
      headingRight={
        currentAction ? undefined : (
          <Text color="GREY" fontSize={1} mb={0}>
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

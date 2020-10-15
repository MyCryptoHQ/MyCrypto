import React, { useState } from 'react';

import styled from 'styled-components';

import { DashboardPanel } from '@components';
import Icon from '@components/Icon';
import { actionTemplates } from '@config';
import { useUserActions } from '@services';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
import { Trans } from '@translations';
import { ActionTemplate } from '@types';

import { Text } from '../NewTypography';
import { ActionDetails, ActionsList } from './components';

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
  max-width: 250px;
`;

export const ActionPanel = () => {
  const { userActions } = useUserActions();
  const [currentAction, setCurrentAction] = useState<ActionTemplate | undefined>();
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
            <Icon width={20} type={currentAction.icon ? currentAction.icon : 'logo-mycrypto'} />
            <HeadingText>{currentAction.heading}</HeadingText>
          </DetailsHeading>
        ) : (
          <Text color="GREY" fontSize={0} mb={0}>
            <Trans
              id="ACTION_PANEL_COMPLETED_COUNT"
              variables={{
                $number: () => userActions.filter((a) => a.state === 'completed').length,
                $total: () => actionTemplates.length
              }}
            />
          </Text>
        )
      }
    >
      {currentAction ? (
        <ActionDetails actionTemplate={currentAction} />
      ) : (
        <ActionsList actionTemplates={actionTemplates} onActionClick={setCurrentAction} />
      )}
    </SDashboardPanel>
  );
};

import React, { useContext } from 'react';

import { Panel } from '@mycrypto/ui';
import { getGreeting, useSelector } from '@store';
import styled from 'styled-components';

import { Checkbox, Link } from '@components';
import { IFeatureFlags } from '@config';
import { useDevTools, useFeatureFlags } from '@services';
import { DataContext } from '@services/Store';
import { BREAK_POINTS } from '@theme';
import { IS_PROD } from '@utils';

import { ErrorContext } from '../ErrorHandling';
import ToolsNotifications from './ToolsNotifications';

const SLink = styled(Link)`
  font-weight: 600;
`;

const SCheckbox = styled(Checkbox)`
  margin-bottom: 0;
`;

const SDevToolsToggle = styled.button`
  position: absolute;
  width: 120px;
`;

const Wrapper = styled.div<{ isActive: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  max-width: 450px;

  ${({ isActive }) => isActive && `height: 100vh;`}

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    max-width: 100vw;
  }
  box-shadow:
    0 2.8px 2.2px rgba(0, 0, 0, 0.02),
    0 6.7px 5.3px rgba(0, 0, 0, 0.028),
    0 12.5px 10px rgba(0, 0, 0, 0.035),
    0 22.3px 17.9px rgba(0, 0, 0, 0.042),
    0 41.8px 33.4px rgba(0, 0, 0, 0.05),
    0 100px 80px rgba(0, 0, 0, 0.07);
`;

const DBTools = () => {
  const { resetAppDb, addSeedData, removeSeedData } = useContext(DataContext);
  return (
    <div style={{ marginBottom: '1em' }}>
      You can choose to
      <SLink onClick={() => resetAppDb()}> Reset</SLink> the database to it's default values. or you
      can <SLink onClick={() => addSeedData()}>add seed accounts</SLink> to your existing DB, or
      revert the process by <SLink onClick={() => removeSeedData()}>removing</SLink> the dev
      accounts.
    </div>
  );
};

const ErrorTools = () => {
  const { suppressErrors, toggleSuppressErrors } = useContext(ErrorContext);
  return (
    <div style={{ marginBottom: '1em' }}>
      <SCheckbox
        name={'suppress_errors'}
        label={'Suppress Errors'}
        checked={suppressErrors}
        onChange={() => toggleSuppressErrors()}
      />
    </div>
  );
};

const FeatureFlags = () => {
  const { featureFlags, setFeatureFlag } = useFeatureFlags();
  return (
    <div style={{ marginBottom: '1em' }}>
      {Object.entries(featureFlags)
        .filter(([, v]) => v !== 'core')
        .map(([k, v]: [keyof IFeatureFlags, boolean]) => (
          <SCheckbox
            key={k}
            name={k}
            label={k}
            checked={v}
            onChange={() => setFeatureFlag(k, !v)}
          />
        ))}
    </div>
  );
};

const DevToolsToggle = () => {
  const { isActive, toggleDevTools } = useDevTools();
  return (
    <SDevToolsToggle onClick={toggleDevTools}>
      {isActive ? 'DevMode On' : 'DevMode Off'}
    </SDevToolsToggle>
  );
};

const DevToolsManager = () => {
  const { isActive } = useDevTools();
  const greeting = useSelector(getGreeting);

  if (IS_PROD) return <></>;

  return (
    <Wrapper isActive={isActive}>
      <DevToolsToggle />
      {isActive && (
        <Panel style={{ marginBottom: 0, paddingTop: 50, width: '400px', height: '100%' }}>
          {/* Toggle feature availability */}
          <p style={{ fontWeight: 600 }}>Feature Flags</p>
          <FeatureFlags />
          {/* Error handling tools */}
          <p style={{ fontWeight: 600 }}>Error Boundary</p>
          <ErrorTools />
          {/* Dashboard notifications */}
          <p style={{ fontWeight: 600 }}>Notifications</p>
          <ToolsNotifications />
          {/* DB tools*/}
          <p style={{ fontWeight: 600 }}>DB Tools</p>
          <DBTools />
          {/* Redux Demo */}
          <p style={{ fontWeight: 600 }}>Redux</p>
          <div>Store Greeting: {greeting}</div>
        </Panel>
      )}
    </Wrapper>
  );
};

export default DevToolsManager;

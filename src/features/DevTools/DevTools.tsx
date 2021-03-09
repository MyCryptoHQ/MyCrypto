import React, { useContext } from 'react';

import { Panel } from '@mycrypto/ui';
import styled from 'styled-components';

import { Checkbox, LinkApp } from '@components';
import { useDevTools, useFeatureFlags } from '@services';
import { FeatureFlag } from '@services/FeatureFlag';
import { appReset, useDispatch } from '@store';
import { BREAK_POINTS } from '@theme';
import { IS_PROD } from '@utils';

import { ErrorContext } from '../ErrorHandling';
import ToolsNotifications from './ToolsNotifications';

const SToggle = styled.button`
  position: fixed;
  bottom: 1.25em;
  right: 1.25em;

  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 0;
  font-size: 1.5em;
  /* From smooth shadow-generator https://s.muz.li/MWNjYTY2Yjk4 */
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.02), 0 6.7px 5.3px rgba(0, 0, 0, 0.028),
    0 12.5px 10px rgba(0, 0, 0, 0.035), 0 22.3px 17.9px rgba(0, 0, 0, 0.042),
    0 41.8px 33.4px rgba(0, 0, 0, 0.05), 0 100px 80px rgba(0, 0, 0, 0.07);
`;

const Wrapper = styled.div<{ isActive: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  max-width: 450px;
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.02),
    0 6.7px 5.3px rgba(0, 0, 0, 0.028),
    0 12.5px 10px rgba(0, 0, 0, 0.035),
    0 22.3px 17.9px rgba(0, 0, 0, 0.042),
    0 41.8px 33.4px rgba(0, 0, 0, 0.05),
    0 100px 80px rgba(0, 0, 0, 0.07);

  ${({ isActive }) => isActive && `height: 100vh;`}

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    max-width: 100vw;
  }

`;

const DBTools = () => {
  const dispatch = useDispatch();
  return (
    <div style={{ marginBottom: '1em' }}>
      You can choose to
      <LinkApp
        href="#"
        onClick={() => {
          dispatch(appReset());
        }}
      >
        {' '}
        Reset
      </LinkApp>{' '}
      the database to it's default values.
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

const SCheckbox = styled(Checkbox)`
  margin-bottom: 0;
  &:hover {
    background-color: ${(props) => props.theme.colors.GREY_LIGHT};
  }
`;

const FeatureFlags = () => {
  const { featureFlags, setFeatureFlag } = useFeatureFlags();

  return (
    <div style={{ marginBottom: '1em' }}>
      {Object.entries(featureFlags)
        .filter(([, v]) => v !== 'core')
        .map(([k, v]: [FeatureFlag, boolean]) => (
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

const DevToolsManager = () => {
  const { isActive, toggleDevTools } = useDevTools();

  if (IS_PROD) return <></>;

  return (
    <Wrapper isActive={isActive}>
      <SToggle onClick={toggleDevTools}>
        <span role="img" aria-label="lollipop">
          🍭
        </span>
      </SToggle>
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
        </Panel>
      )}
    </Wrapper>
  );
};

export default DevToolsManager;

import React, { useContext, useEffect } from 'react';

import { Panel } from '@mycrypto/ui';
import styled from 'styled-components';

import { Checkbox, Link } from '@components';
import { IFeatureFlags } from '@config';
import { useAnalytics } from '@hooks';
import { useDevTools, useFeatureFlags } from '@services';
import { DataContext } from '@services/Store';
import { useDispatch, useSelector } from '@store';
import { BREAK_POINTS } from '@theme';
import { IS_PROD } from '@utils';

import { ErrorContext } from '../ErrorHandling';
import { getCount, getGreeting, increment, reset } from './slice';
import ToolsNotifications from './ToolsNotifications';

const SLink = styled(Link)`
  font-weight: 600;
`;

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
  const { resetAppDb } = useContext(DataContext);
  return (
    <div style={{ marginBottom: '1em' }}>
      You can choose to
      <SLink onClick={() => resetAppDb()}> Reset</SLink> the database to it's default values.
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
  const { featureFlags, setFeatureFlag, isFeatureActive } = useFeatureFlags();
  const { track, initAnalytics } = useAnalytics();

  // By definition, the app is already loaded when we toggle the feature
  // flag so we make sure the load event is triggered when the flag is set.
  useEffect(() => {
    if (!isFeatureActive('ANALYTICS')) return; // @todo: clear the id if unset
    initAnalytics();
    track({ name: 'App Load' });
  }, [featureFlags.ANALYTICS]);

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

const DemoRedux = () => {
  const greeting = useSelector(getGreeting);
  const count = useSelector(getCount);
  const dispatch = useDispatch();
  const handleIncrement = () => dispatch(increment());
  const handleReset = () => dispatch(reset());

  return (
    <div style={{ marginBottom: '1em' }}>
      <div>
        {greeting} {count}
      </div>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleReset}>Reset</button>
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
          {/* Redux Demo */}
          <p style={{ fontWeight: 600 }}>Redux Demo</p>
          <DemoRedux />
        </Panel>
      )}
    </Wrapper>
  );
};

export default DevToolsManager;

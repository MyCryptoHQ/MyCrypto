import React, { useState } from 'react';

import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { ContentPanel } from '@components';
import { ScreenLockContext } from '@features/ScreenLock';
import { useAssets, useSettings } from '@services/Store';
import { translateRaw } from '@translations';

import { ImportBox, ImportSuccess } from './components';

const Content = styled.div`
  text-align: center;
`;

export interface PanelProps {
  onBack(): void;
  onNext(): void;
}

export const Import = (props: RouteComponentProps) => {
  const { assets } = useAssets();
  const { importStorage } = useSettings();
  const [step, setStep] = useState(0);

  const { history } = props;

  const advanceStep = () => setStep(1);

  const regressStep = () => setStep(Math.min(0, step - 1));

  const steps = [
    {
      heading: translateRaw('SETTINGS_IMPORT_HEADING'),
      component: ImportBox,
      backOption: history.goBack
    },
    {
      heading: translateRaw('SETTINGS_IMPORT_SUCCESS_HEADING'),
      component: ImportSuccess,
      backOption: regressStep
    }
  ];
  const onBack = steps[step].backOption;
  const Step = steps[step].component;
  return (
    <ContentPanel
      width={560}
      onBack={onBack}
      heading={steps[step].heading}
      stepper={{
        current: step + 1,
        total: steps.length
      }}
    >
      <Content>
        <ScreenLockContext.Consumer>
          {({ resetEncrypted }) => (
            <Step
              onNext={advanceStep}
              importCache={(cache: string) => {
                const result = importStorage(cache)(assets);
                if (result) {
                  resetEncrypted();
                }
                return result;
              }}
            />
          )}
        </ScreenLockContext.Consumer>
      </Content>
    </ContentPanel>
  );
};

export default withRouter(Import);

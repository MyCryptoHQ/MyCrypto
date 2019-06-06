import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
// import { Button, Typography, Input } from '@mycrypto/ui';
import styled from 'styled-components';

import { ContentPanel } from 'v2/components';
import { ImportBox, ImportSuccess } from './components';
import { Layout } from 'v2/features';
import { GlobalSettingsContext } from 'v2/providers';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const CenteredContentPanel = styled(ContentPanel)`
  width: 35rem;
`;

export interface PanelProps {
  onBack(): void;
  onNext(): void;
}

export class Import extends React.Component<RouteComponentProps<{}>> {
  public state = { step: 0 };

  public render() {
    const { history } = this.props;
    const { step } = this.state;
    const steps = [
      {
        heading: 'Import',
        component: ImportBox,
        backOption: history.goBack
      },
      {
        heading: 'Import Complete',
        component: ImportSuccess,
        backOption: this.regressStep
      }
    ];
    const onBack = steps[step].backOption;
    const Step = steps[step].component;
    return (
      <Layout centered={true}>
        <CenteredContentPanel
          onBack={onBack}
          heading={steps[step].heading}
          stepper={{
            current: step + 1,
            total: steps.length
          }}
        >
          <Content>
            <GlobalSettingsContext.Consumer>
              {({ localStorage, importCache }) => (
                <Step
                  onNext={this.advanceStep}
                  importCache={importCache}
                  localStorage={localStorage}
                />
              )}
            </GlobalSettingsContext.Consumer>
          </Content>
        </CenteredContentPanel>
      </Layout>
    );
  }

  private advanceStep = () =>
    this.setState(() => ({
      step: 1
    }));

  private regressStep = () =>
    this.setState((prevState: any) => ({
      step: Math.min(0, prevState.step - 1)
    }));
}

export default withRouter(Import);

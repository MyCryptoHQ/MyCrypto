import React from 'react';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
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

const steps = [ImportBox, ImportSuccess];
const headings = ['Import', 'Import Complete'];

export class Import extends React.Component<RouteComponentProps<{}>> {
  public state = { step: 0 };

  public render() {
    const { history } = this.props;
    const { step } = this.state;
    const backOptions = [history.goBack, this.regressStep];
    const onBack = backOptions[step];
    const Step = steps[step];
    return (
      <Layout centered={true}>
        <CenteredContentPanel
          onBack={onBack}
          heading={headings[step]}
          stepper={{
            current: step + 1,
            total: steps.length
          }}
        >
          <Content>
            <GlobalSettingsContext.Consumer>
              {({ importCache }) => <Step onNext={this.advanceStep} importCache={importCache} />}
            </GlobalSettingsContext.Consumer>
          </Content>
        </CenteredContentPanel>
      </Layout>
    );
  }

  private advanceStep = () =>
    this.setState((prevState: any) => ({
      step: Math.min(prevState.step + 1, steps.length - 1)
    }));

  private regressStep = () =>
    this.setState((prevState: any) => ({
      step: Math.min(0, prevState.step - 1)
    }));
}

export default withRouter(Import);

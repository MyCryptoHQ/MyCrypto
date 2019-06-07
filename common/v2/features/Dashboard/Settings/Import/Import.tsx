import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import { ContentPanel } from 'v2/components';
import { ImportBox, ImportSuccess } from './components';
import { Layout } from 'v2/features';
import { SettingsContext } from 'v2/providers';
import { translateRaw } from 'translations';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const CenteredContentPanel = styled(ContentPanel)`
  width: 35rem;
  h1 {
    font-size: 24px;
  }
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
        heading: translateRaw('SETTINGS_IMPORT_HEADING'),
        component: ImportBox,
        backOption: history.goBack
      },
      {
        heading: translateRaw('SETTINGS_IMPORT_SUCCESS_HEADING'),
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
            <SettingsContext.Consumer>
              {({ importStorage }) => (
                <Step onNext={this.advanceStep} importCache={importStorage} />
              )}
            </SettingsContext.Consumer>
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

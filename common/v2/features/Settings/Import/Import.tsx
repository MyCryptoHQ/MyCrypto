import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import { ContentPanel } from 'v2/components';
import { SettingsContext } from 'v2/services/Store';
import { translateRaw } from 'v2/translations';

import { ImportBox, ImportSuccess } from './components';

const Content = styled.div`
  text-align: center;
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
      <ContentPanel
        width="35rem"
        onBack={onBack}
        heading={steps[step].heading}
        stepper={{
          current: step + 1,
          total: steps.length
        }}
      >
        <Content>
          <SettingsContext.Consumer>
            {({ importStorage }) => <Step onNext={this.advanceStep} importCache={importStorage} />}
          </SettingsContext.Consumer>
        </Content>
      </ContentPanel>
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

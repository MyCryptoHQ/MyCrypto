import { Component } from 'react';

import { AnyAction, bindActionCreators, Dispatch } from '@reduxjs/toolkit';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { ContentPanel } from '@components';
import { AppState, importError, importState, importSuccess } from '@store';
import { translateRaw } from '@translations';
import { goBack } from '@utils';

import { ImportBox, ImportSuccess } from './components';

const Content = styled.div`
  text-align: center;
`;

export class Import extends Component<Props> {
  public state = { step: 0 };

  public render() {
    const { history, importState, importSuccess, importFailure } = this.props;
    const onBackFunc = () => goBack(history);
    const { step } = this.state;
    const steps = [
      {
        heading: translateRaw('SETTINGS_IMPORT_HEADING'),
        component: ImportBox,
        backOption: onBackFunc
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
        width={560}
        onBack={onBack}
        heading={steps[step].heading}
        stepper={{
          current: step + 1,
          total: steps.length
        }}
      >
        <Content>
          <Step
            onNext={this.advanceStep}
            importSuccess={importSuccess}
            importFailure={importFailure}
            importState={importState}
          />
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

const mapStateToProps = (state: AppState) => ({
  importSuccess: importSuccess(state),
  importFailure: !!importError(state)
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      importState: importState
    },
    dispatch
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector> & RouteComponentProps;

export default withRouter(connector(Import));

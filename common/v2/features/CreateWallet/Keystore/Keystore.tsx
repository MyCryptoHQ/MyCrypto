import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Layout } from 'v2/features';
import { KeystoreProvider, KeystoreContext } from './components';
import { KeystoreStages, keystoreStageToComponentHash, keystoreFlow } from './constants';

export default class CreateWallet extends Component<RouteComponentProps<{}>> {
  public state = {
    stage: KeystoreStages.SelectNetwork
  };

  public render() {
    const { stage } = this.state;
    const ActivePanel = keystoreStageToComponentHash[stage];
    const actions = {
      onBack: this.regressToPreviousStage,
      onNext: this.advanceToNextStage
    };
    const isKeystorePanel = [KeystoreStages.GenerateKeystore, KeystoreStages.SaveKeystore].includes(
      stage
    );

    return (
      <KeystoreProvider>
        <Layout centered={true}>
          <section className="CreateWallet">
            {isKeystorePanel ? (
              <KeystoreContext.Consumer>
                {({}) => <ActivePanel totalSteps={3} {...actions} />}
              </KeystoreContext.Consumer>
            ) : (
              <ActivePanel totalSteps={3} {...actions} />
            )}
          </section>
        </Layout>
      </KeystoreProvider>
    );
  }

  private regressToPreviousStage = () => {
    const { history } = this.props;
    const { stage } = this.state;
    const currentIndex = keystoreFlow.indexOf(stage);
    const previousStage = keystoreFlow[currentIndex - 1];

    if (previousStage != null) {
      this.setState({ stage: previousStage });
    } else {
      history.push('/');
    }
  };

  private advanceToNextStage = () => {
    const { stage } = this.state;
    const currentIndex = keystoreFlow.indexOf(stage);
    const nextStage = keystoreFlow[currentIndex + 1];

    if (nextStage != null) {
      this.setState({ stage: nextStage });
    }
  };
}

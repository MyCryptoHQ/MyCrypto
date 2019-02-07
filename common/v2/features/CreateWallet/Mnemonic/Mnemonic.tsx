import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Layout } from 'v2/features';
import { MnemonicProvider, MnemonicContext } from './components';
import { MnemonicStages, mnemonicStageToComponentHash, mnemonicFlow } from './constants';

export default class CreateWallet extends Component<RouteComponentProps<{}>> {
  public state = {
    stage: MnemonicStages.SelectNetwork
  };

  public render() {
    const { stage } = this.state;
    const ActivePanel = mnemonicStageToComponentHash[stage];
    const actions = {
      onBack: this.regressToPreviousStage,
      onNext: this.advanceToNextStage
    };
    const isMnemonicPanel = [
      MnemonicStages.GeneratePhrase,
      MnemonicStages.BackUpPhrase,
      MnemonicStages.ConfirmPhrase
    ].includes(stage);

    return (
      <MnemonicProvider>
        <Layout centered={true}>
          <section className="CreateWallet">
            {isMnemonicPanel ? (
              <MnemonicContext.Consumer>
                {({ words, generateWords }) => (
                  <ActivePanel words={words} generateWords={generateWords} {...actions} />
                )}
              </MnemonicContext.Consumer>
            ) : (
              <ActivePanel totalSteps={4} {...actions} />
            )}
          </section>
        </Layout>
      </MnemonicProvider>
    );
  }

  private regressToPreviousStage = () => {
    const { history } = this.props;
    const { stage } = this.state;
    const currentIndex = mnemonicFlow.indexOf(stage);
    const previousStage = mnemonicFlow[currentIndex - 1];

    if (previousStage != null) {
      this.setState({ stage: previousStage });
    } else {
      history.push('/');
    }
  };

  private advanceToNextStage = () => {
    const { stage } = this.state;
    const currentIndex = mnemonicFlow.indexOf(stage);
    const nextStage = mnemonicFlow[currentIndex + 1];

    if (nextStage != null) {
      this.setState({ stage: nextStage });
    }
  };
}

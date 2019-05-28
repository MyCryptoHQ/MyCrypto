import React, { Component, ReactType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { generateMnemonic } from 'bip39';

import { Layout } from 'v2/features';
import { MnemonicStages, mnemonicStageToComponentHash, mnemonicFlow } from './constants';

export default class CreateWallet extends Component<RouteComponentProps<{}>> {
  public state = {
    stage: MnemonicStages.SelectNetwork,
    words: []
  };

  public render() {
    const { stage, words } = this.state;
    const currentStep: number = mnemonicFlow.indexOf(stage) + 1;
    const ActivePanel: ReactType = mnemonicStageToComponentHash[stage];
    const actions = {
      onBack: this.regressToPreviousStage,
      onNext: this.advanceToNextStage,
      navigateToDashboard: this.navigateToDashboard,
      generateWords: this.generateWords
    };
    const isMnemonicPanel = [
      MnemonicStages.GeneratePhrase,
      MnemonicStages.BackUpPhrase,
      MnemonicStages.ConfirmPhrase
    ].includes(stage);

    return (
      <Layout centered={true}>
        <section className="CreateWallet">
          {isMnemonicPanel ? (
            <ActivePanel currentStep={currentStep} totalSteps={4} words={words} {...actions} />
          ) : (
            <ActivePanel currentStep={currentStep} totalSteps={4} {...actions} />
          )}
        </section>
      </Layout>
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
      history.push('/create-wallet');
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

  private navigateToDashboard = () => {
    const { history } = this.props;
    history.replace('/dashboard');
  };

  private generateWords = () => {
    this.setState({
      words: generateMnemonic().split(' ')
    });
  };
}

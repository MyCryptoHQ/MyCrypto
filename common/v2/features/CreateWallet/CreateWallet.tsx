import React, { Component } from 'react';

import { Layout } from 'v2/components';
import { isDesktop } from 'v2/utils';
import { MnemonicProvider, MnemonicContext } from './components';
import {
  CreateWalletStages,
  createWalletStageToComponentHash,
  createWalletMnemonicFlow
} from './constants';

export interface PanelProps {
  onBack(): void;
  onNext(): void;
}

export default class CreateWallet extends Component {
  public state = {
    stage: isDesktop() ? CreateWalletStages.SelectNetwork : CreateWalletStages.SelectNetwork
  };

  public render() {
    const { stage } = this.state;
    const ActivePanel = createWalletStageToComponentHash[stage];
    const actions = {
      onBack: this.regressToPreviousStage,
      onNext: this.advanceToNextStage
    };
    const isMnemonicPanel = [
      CreateWalletStages.GeneratePhrase,
      CreateWalletStages.ConfirmPhrase
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
              <ActivePanel {...actions} />
            )}
          </section>
        </Layout>
      </MnemonicProvider>
    );
  }

  private regressToPreviousStage = () => {
    const { stage } = this.state;
    const currentIndex = createWalletMnemonicFlow.indexOf(stage);
    const previousStage = createWalletMnemonicFlow[currentIndex - 1];

    if (previousStage != null) {
      this.setState({ stage: previousStage });
    }
  };

  private advanceToNextStage = () => {
    const { stage } = this.state;
    const currentIndex = createWalletMnemonicFlow.indexOf(stage);
    const nextStage = createWalletMnemonicFlow[currentIndex + 1];

    if (nextStage != null) {
      this.setState({ stage: nextStage });
    }
  };
}

import React, { Component } from 'react';

import { Layout } from 'v2/components';
import { isDesktop } from 'v2/utils';
import { MnemonicProvider, MnemonicContext } from './components';
import { CreateWalletStages, createWalletStageToComponentHash } from './constants';

export default class CreateWallet extends Component {
  public state = {
    // stage: isDesktop() ? CreateWalletStages.SelectNetwork : CreateWalletStages.DownloadApp
    stage: CreateWalletStages.GeneratePhrase
  };

  public render() {
    const { stage } = this.state;
    const ActivePanel = createWalletStageToComponentHash[stage];
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
                  <ActivePanel words={words} generateWords={generateWords} />
                )}
              </MnemonicContext.Consumer>
            ) : (
              <ActivePanel />
            )}
          </section>
        </Layout>
      </MnemonicProvider>
    );
  }
}

import React, { Component } from 'react';

import { Layout } from 'v2/components';
import { isDesktop } from 'v2/utils';
import { CreateWalletStages, createWalletStageToComponentHash } from './constants';

export default class CreateWallet extends Component {
  public state = {
    stage: isDesktop() ? CreateWalletStages.SelectNetwork : CreateWalletStages.DownloadApp
  };

  public render() {
    const { stage } = this.state;
    const ActivePanel = createWalletStageToComponentHash[stage];

    return (
      <Layout centered={true}>
        <section className="CreateWallet">
          <ActivePanel />
        </section>
      </Layout>
    );
  }
}

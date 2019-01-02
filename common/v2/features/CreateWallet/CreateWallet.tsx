import React, { Component } from 'react';

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
      <section className="CreateWallet">
        <ActivePanel />
      </section>
    );
  }
}

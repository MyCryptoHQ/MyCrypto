import React, { Component } from 'react';

import { ImportWalletStages, importWalletStageToComponentHash } from './constants';

export default class CreateWallet extends Component {
  public state = {
    stage: ImportWalletStages.SelectMethod
  };

  public render() {
    const { stage } = this.state;
    const ActivePanel = importWalletStageToComponentHash[stage];

    return (
      <section className="ImportWallet">
        <ActivePanel />
      </section>
    );
  }
}

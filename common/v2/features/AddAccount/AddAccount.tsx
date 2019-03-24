import React, { Component } from 'react';

import { ImportAddAccountStages, importAddAccountStageToComponentHash } from './constants';

export default class AddAccount extends Component {
  public state = {
    stage: ImportAddAccountStages.SelectMethod
  };

  public render() {
    const { stage } = this.state;
    const ActivePanel = importAddAccountStageToComponentHash[stage];

    return (
      <section className="AddAccount">
        <ActivePanel />
      </section>
    );
  }
}

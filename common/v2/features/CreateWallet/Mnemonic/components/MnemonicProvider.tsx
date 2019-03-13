import React, { Component } from 'react';
import { generateMnemonic } from 'bip39';

export const MnemonicContext = React.createContext({} as { words: never[]; generateWords(): void });

export default class MnemonicProvider extends Component {
  public state = {
    words: [],
    generateWords: () =>
      this.setState({
        words: generateMnemonic().split(' ')
      })
  };

  public render() {
    const { children } = this.props;

    return <MnemonicContext.Provider value={this.state}>{children}</MnemonicContext.Provider>;
  }
}

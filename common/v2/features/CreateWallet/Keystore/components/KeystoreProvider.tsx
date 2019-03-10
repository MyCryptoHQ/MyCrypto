import React, { Component } from 'react';

export const KeystoreContext = React.createContext({});

export default class KeystoreProvider extends Component {
  public state = {};

  public render() {
    const { children } = this.props;

    return <KeystoreContext.Provider value={this.state}>{children}</KeystoreContext.Provider>;
  }
}

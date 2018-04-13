import React from 'react';
import { IWallet } from 'libs/wallet';

interface Props {
  wallet: IWallet;
}

export default class AddressBook extends React.Component<Props> {
  public render() {
    return <p>AddressBook</p>;
  }
}

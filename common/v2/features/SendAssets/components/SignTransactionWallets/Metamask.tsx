import React, { Component } from 'react';
import MetamaskSVG from 'common/assets/images/wallets/metamask-2.svg';
import './MetaMask.scss';
import * as ethers from 'ethers';
import { AsyncSendable } from 'ethers/providers/web3-provider';
import { ISendState } from '../../types';

type AsyncSendableMetamask = AsyncSendable & { enable(): Promise<boolean> };

declare global {
  interface Window {
    ethereum?: AsyncSendableMetamask;
    web3: any;
  }
}

interface Props {
  stateValues: ISendState;
}

interface MetaMaskUserState {
  account: string;
  network: string;
  provider: boolean;
  // provider2: Web3Provider | null;
  metaMaskAccountMatches: boolean;
}

const DEFAULT_NETWORK_FOR_FALLBACK = 'ropsten';

export default class SignTransactionMetaMask extends Component<Props> {
  public state: MetaMaskUserState = {
    account: '',
    network: '',
    provider: false,
    metaMaskAccountMatches: false
  };

  public componentDidMount() {
    this.getMetaMaskProvider();
  }

  public render() {
    // const { stateValues: { transactionFields: { senderAddress } } } = this.props;
    return (
      <div className="SignTransactionMetaMask-panel">
        <div className="SignTransactionMetaMask-title">Sign the Transaction with MetaMask</div>
        <div className="SignTransactionMetaMask-instructions">
          Sign into MetaMask on your computer and follow the isntructions in the MetaMask window.{' '}
        </div>
        <div className="SignTransactionMetaMask-img">
          <img src={MetamaskSVG} />
        </div>
        <div className="SignTransactionMetaMask-input">
          <div className="SignTransactionMetaMask-description">
            Because we never save, store, or transmit your secret, you need to sign each transaction
            in order to send it. MyCrypto puts YOU in control of your assets.
          </div>
          <div className="SignTransactionMetaMask-footer">
            <div className="SignTransactionMetaMask-help">
              Not working? Here's some troubleshooting tips to try
            </div>
          </div>
        </div>
      </div>
    );
  }
  // private signTransaction() {

  // }

  private checkAddressMatches(metaMaskAddress: string) {
    // console.log(senderAddress, account);
    if (metaMaskAddress === this.state.account) {
      return this.setState({ metaMaskAccountMatches: true });
    }
  }

  private async getMetaMaskProvider() {
    if (window.ethereum) {
      await window.ethereum.enable();
      const metaMaskProvider = new ethers.providers.Web3Provider(window.ethereum);
      const metaMaskSigner = await metaMaskProvider.getSigner();
      const metaMaskNetwork = await metaMaskProvider.getNetwork();
      const metaMaskAddress = await metaMaskSigner.getAddress();

      await this.setState({
        account: metaMaskAddress,
        network: metaMaskNetwork.chainId,
        provider: metaMaskSigner !== null ? true : false
      });
      this.checkAddressMatches(metaMaskAddress);
      console.log(this.state);
    } else {
      const defaultProvider = ethers.getDefaultProvider(DEFAULT_NETWORK_FOR_FALLBACK);
      this.setState({ provider: defaultProvider });
    }
  }
}

import React, { Component } from 'react';
import { ethers, utils } from 'ethers';
import { AsyncSendable } from 'ethers/providers/web3-provider';
import { ISendState, ITxFields } from '../../types';

import MetamaskSVG from 'common/assets/images/wallets/metamask-2.svg';
import './MetaMask.scss';
// import ethereumjs from 'ethereumjs-tx';

// const transaction = {
//   nonce: 0,
//   gasLimit: 21000,
//   gasPrice: utils.bigNumberify('20000000000'),
//   to: '0x88a5C2d9919e46F883EB62F7b8Dd9d0CC45bc290',
//   // ... or supports ENS names
//   value: utils.parseEther('0.01'),
//   data: '0x',
//   // This ensures the transaction cannot be replayed on different networks
//   chainId: ethers.utils.getNetwork('homestead').chainId
// };

type AsyncSendableMetamask = AsyncSendable & {
  on(evt: string, cb: (params: any[]) => void): void;
  enable(): Promise<boolean>;
};

declare global {
  interface Window {
    ethereum?: AsyncSendableMetamask;
    web3: any;
  }
}
interface Props {
  stateValues: ISendState;
  transactionFields: ITxFields;
}

interface MetaMaskUserState {
  account: string;
  network: string;
  provider: null | boolean;
  accountMatches: boolean;
  networkMatches: boolean;
  signer: boolean;
  initNetworkPolling: null;
}

const DEFAULT_NETWORK_FOR_FALLBACK = 'ropsten';

export default class SignTransactionMetaMask extends Component<Props> {
  public state: MetaMaskUserState = {
    account: '',
    network: '',
    accountMatches: false,
    provider: null,
    signer: false,
    networkMatches: false,
    initNetworkPolling: null
  };

  constructor(props: Props) {
    super(props);
    this.getMetaMaskProviderAndSigner = this.getMetaMaskProviderAndSigner.bind(this);
  }

  public componentDidMount() {
    this.getMetaMaskProviderAndSigner();

    // this.initMetMaskPolling();
  }

  public render() {
    const { stateValues } = this.props;
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
          {this.state.accountMatches === false && (
            <div className="SignTransactionMetaMask-wrong-address">
              {' '}
              Please switch the account in MetaMask to {
                stateValues.transactionFields.senderAddress
              }{' '}
              <br /> in order to proceed{' '}
            </div>
          )}
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

  private checkAddressMatches(metaMaskAddress: string, stateValues: ISendState) {
    const desiredAddress = utils.getAddress(stateValues.transactionFields.senderAddress);

    this.setState({ metaMaskAccountMatches: metaMaskAddress === desiredAddress });
  }

  private checkNetworkMatches(metaMaskNetwork: string, stateValues: ISendState) {
    const desiredNetwork = stateValues.network;

    if (metaMaskNetwork === desiredNetwork) {
      this.setState({ metaMaskNetworkMatches: true });
    } else {
      this.setState({ metaMaskNetworkMatches: false });
    }
  }

  private async getMetaMaskProviderAndSigner() {
    if (window.ethereum) {
      await window.ethereum.enable();
      const metaMaskProvider = new ethers.providers.Web3Provider(window.ethereum);
      const metaMaskSigner = await metaMaskProvider.getSigner();
      const metaMaskNetwork = await metaMaskProvider.getNetwork();
      const metaMaskAddress = await metaMaskSigner.getAddress();

      const checksumAddress = utils.getAddress(metaMaskAddress);

      await this.setState({
        account: checksumAddress,
        network: metaMaskNetwork.chainId,
        metaMaskProvider,
        metaMaskSigner
      });
      this.watchForAccountChanges(window.ethereum);
      this.checkAddressMatches(checksumAddress, this.props.stateValues);
      this.checkNetworkMatches(metaMaskNetwork.name, this.props.stateValues);
      // metaMaskSigner.sendTransaction(transaction);

      console.log(this.state);
    } else {
      const defaultProvider = ethers.getDefaultProvider(DEFAULT_NETWORK_FOR_FALLBACK);
      this.setState({ provider: defaultProvider });
    }
  }

  private watchForAccountChanges(ethereum: NonNullable<Window['ethereum']>) {
    ethereum.on('accountsChanged', this.getMetaMaskProviderAndSigner);
  }
}

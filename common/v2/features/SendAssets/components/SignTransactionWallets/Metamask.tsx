import MetamaskSVG from 'common/assets/images/wallets/metamask-2.svg';
import * as ethers from 'ethers';
// tslint:disable-next-line: no-duplicate-imports
import { utils } from 'ethers';
import { AsyncSendable, Web3Provider } from 'ethers/providers/web3-provider';
import React, { Component } from 'react';
import { ISendState, ITxFields } from '../../types';
import './MetaMask.scss';

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

// const networks = {
//   ethereum: 1,
//   ropsten: 3,
//   rinkeby: 4,
//   kovan: 42
// };

interface Props {
  stateValues: ISendState;
  transactionFields: ITxFields;
}

interface MetaMaskUserState {
  account: string;
  network: string;
  metaMaskSigner: any;
  metaMaskProvider: Web3Provider | null;
  metaMaskAccountMatches: boolean;
  metaMaskNetworkMatches: boolean;
  initAccountPolling: null;
}

const DEFAULT_NETWORK_FOR_FALLBACK = 'ropsten';

export default class SignTransactionMetaMask extends Component<Props> {
  public state: MetaMaskUserState = {
    account: '',
    network: '',
    metaMaskProvider: null,
    metaMaskSigner: false,
    metaMaskAccountMatches: false,
    metaMaskNetworkMatches: false,
    initAccountPolling: null
  };

  constructor(props: Props) {
    super(props);
    this.getMetaMaskProviderAndSigner = this.getMetaMaskProviderAndSigner.bind(this);
  }

  public componentDidMount() {
    this.getMetaMaskProviderAndSigner();
    this.initMetMaskPolling();
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
          {this.state.metaMaskAccountMatches === false && (
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
  // private signTransaction() {

  // }

  private initMetMaskPolling() {
    setInterval(this.getMetaMaskProviderAndSigner, 2000);
  }

  private checkAddressMatches(metaMaskAddress: string, stateValues: ISendState) {
    const desiredAddress = utils.getAddress(stateValues.transactionFields.senderAddress);

    if (metaMaskAddress === desiredAddress) {
      return this.setState({ metaMaskAccountMatches: true });
    } else {
      return this.setState({ metaMaskAccountMatches: false });
    }
  }

  // private checkNetworkMatches(metaMaskNetwork: string, stateValues: ISendState) {
  //   const desiredNetwork = stateValues.network;

  //   if (metaMaskNetwork === desiredNetwork) {
  //     return this.setState({ metaMaskNetworkMatches: true });
  //   } else {
  //     return this.setState({ metaMaskNetworkMatches: false });
  //   }
  // }

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

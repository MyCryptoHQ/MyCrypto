import React, { Component } from 'react';
import { ethers, utils } from 'ethers';
import { Web3Provider } from 'ethers/providers/web3-provider';
import { ISendState, ITxFields } from '../../types';

import MetamaskSVG from 'common/assets/images/wallets/metamask-2.svg';
import './MetaMask.scss';

// Replace this with the data passed in from FormData
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

declare global {
  interface Window {
    ethereum?: any;
    web3: any;
    metaMaskProvider: ethers.providers.Web3Provider;
    metaMaskSigner: Web3Provider;
  }
}
interface Props {
  stateValues: ISendState;
  transactionFields: ITxFields;
}

interface MetaMaskUserState {
  account: string | undefined;
  network: string | undefined;
  accountMatches: boolean;
  networkMatches: boolean;
}

// this will be changed when we figure out networks
const DEFAULT_NETWORK_FOR_FALLBACK = 'ropsten';

const ethereumProvider = window.ethereum;
let metaMaskProvider: ethers.providers.Web3Provider;

async function getMetaMaskProvider() {
  if (ethereumProvider) {
    await ethereumProvider.enable();
    return (metaMaskProvider = new ethers.providers.Web3Provider(ethereumProvider));
  } else {
    return ethers.getDefaultProvider(DEFAULT_NETWORK_FOR_FALLBACK);
  }
}

export default class SignTransactionMetaMask extends Component<Props> {
  public state: MetaMaskUserState = {
    account: undefined,
    network: undefined,
    accountMatches: false,
    networkMatches: false
  };

  constructor(props: Props) {
    super(props);
    this.getMetaMaskAccount = this.getMetaMaskAccount.bind(this);
  }

  public async initProvider() {
    await getMetaMaskProvider();

    if (ethereumProvider) {
      await this.watchForAccountChanges(ethereumProvider);
    }

    await this.getMetaMaskAccount();
  }

  public componentDidMount() {
    this.initProvider();
  }

  public render() {
    const { stateValues } = this.props;
    const { accountMatches, networkMatches } = this.state;

    return (
      <div className="SignTransaction-panel">
        <div className="SignTransactionMetaMask-title">Sign the Transaction with MetaMask</div>
        <div className="SignTransactionMetaMask-instructions">
          Sign into MetaMask on your computer and follow the isntructions in the MetaMask window.
        </div>
        <div className="SignTransactionMetaMask-img">
          <img src={MetamaskSVG} />
        </div>
        <div className="SignTransactionMetaMask-input">
          {!networkMatches && (
            <div className="SignTransactionMetaMask-wrong-network">
              {' '}
              Please switch the network in MetaMask to {stateValues.network}
            </div>
          )}
          {!accountMatches && (
            <div className="SignTransactionMetaMask-wrong-address">
              Please switch the account in MetaMask to{' '}
              {stateValues.transactionFields.account.address}
              <br /> in order to proceed
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
  private async getMetaMaskAccount() {
    if (metaMaskProvider) {
      const metaMaskSigner = await metaMaskProvider.getSigner();
      const metaMaskAddress = await metaMaskSigner.getAddress();
      const checksumAddress = await utils.getAddress(metaMaskAddress);

      await this.setState({ account: checksumAddress });
      this.getMetaMaskNetwork();
      this.checkAddressMatches(checksumAddress, this.props.stateValues);
    }
  }

  private async getMetaMaskNetwork() {
    if (metaMaskProvider) {
      const metaMaskNetwork = await metaMaskProvider.getNetwork();

      await this.setState({ network: metaMaskNetwork.chainId });
      this.checkNetworkMatches(metaMaskNetwork.name, this.props.stateValues);
    }
  }

  private checkAddressMatches(metaMaskAddress: string, stateValues: ISendState) {
    const desiredAddress = utils.getAddress(stateValues.transactionFields.account.address);

    this.setState({ accountMatches: metaMaskAddress === desiredAddress });
  }

  private checkNetworkMatches(metaMaskNetwork: string, stateValues: ISendState) {
    const desiredNetwork = stateValues.network;

    if (metaMaskNetwork === desiredNetwork) {
      this.setState({ networkMatches: true });
    } else {
      this.setState({ networkMatches: false });
    }
  }

  private watchForAccountChanges(ethereum: NonNullable<Window['ethereum']>) {
    ethereum.on('accountsChanged', this.getMetaMaskNetwork);

    this.setState({ networkMatches: true });
  }

  // private triggerTransaction() {
  //   if (this.state.accountMatches && this.state.networkMatches) {
  //     this.signTransaction();
  //   }
  // }

  // private async signTransaction() {
  //   const signerWallet = await metaMaskProvider.getSigner();
  //   signerWallet.sendTransaction(transaction).catch(err => {
  //     if (err.message.includes('User denied transaction signature')) {
  //       this.setState({ transactionComplete: false });
  //     }
  //   });
  // }
}

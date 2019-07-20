import React, { Component } from 'react';
import { ethers, utils } from 'ethers';
import { Web3Provider } from 'ethers/providers/web3-provider';

import MetamaskSVG from 'common/assets/images/wallets/metamask-2.svg';
import { getNetworkByChainId } from 'v2/services/Store';
import { ISendState, ITxFields } from '../../types';
import './MetaMask.scss';

//Test Transaction
const transaction = {
  nonce: 0,
  gasLimit: 21000,
  gasPrice: utils.bigNumberify('20000000000'),
  to: '0x88a5C2d9919e46F883EB62F7b8Dd9d0CC45bc290',
  // ... or supports ENS names
  value: utils.parseEther('0.00001'),
  data: '0x',
  // This ensures the transaction cannot be replayed on different networks
  chainId: ethers.utils.getNetwork('ropsten').chainId
};

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
  onNext(receipt: ethers.providers.TransactionResponse): void;
  // updateState(state: DeepPartial<ISendState>): void;
}

enum WalletSigningState {
  READY, //when signerWallet is ready to sendTransaction
  NOT_READY, //use when signerWallet rejects transaction
  UNKNOWN //used upon component initialization when wallet status is not determined
}

interface MetaMaskUserState {
  account: string | undefined;
  network: number | undefined;
  accountMatches: boolean;
  networkMatches: boolean;
  walletState: WalletSigningState;
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

export default class SignTransactionMetaMask extends Component<Props, MetaMaskUserState> {
  public state: MetaMaskUserState = {
    account: undefined,
    network: undefined,
    accountMatches: false,
    networkMatches: false,
    walletState: WalletSigningState.UNKNOWN
  };

  constructor(props: Props) {
    super(props);
    this.getMetaMaskAccount = this.getMetaMaskAccount.bind(this);
  }

  public async initProvider() {
    await getMetaMaskProvider();

    if (ethereumProvider) {
      this.getMetaMaskAccount();
      this.watchForAccountChanges(ethereumProvider);
    } else {
      throw Error('No web3 found');
    }
  }

  public componentWillMount() {
    this.initProvider();
  }

  public render() {
    const { stateValues } = this.props;
    const { accountMatches, networkMatches, walletState } = this.state;
    return (
      <div className="SignTransaction-panel">
        <div className="SignTransactionMetaMask-title">Sign the Transaction with MetaMask</div>
        <div className="SignTransactionMetaMask-instructions">
          Sign into MetaMask on your computer and follow the isntructions in the MetaMask window.
        </div>
        <div className="SignTransactionMetaMask-img">
          <img src={MetamaskSVG} />
        </div>
        {walletState === WalletSigningState.NOT_READY ? (
          <div className="SignTransactionMetaMask-rejection">
            Transaction has been rejected or there was an error. Please restart send-flow
          </div>
        ) : null}

        <div className="SignTransactionMetaMask-input">
          {!networkMatches && (
            <div className="SignTransactionMetaMask-wrong-network">
              {' '}
              Please switch the network in MetaMask to{' '}
              {stateValues.transactionFields.account.network}
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
    if (!metaMaskProvider) {
      return;
    }

    const metaMaskSigner = metaMaskProvider.getSigner();
    const metaMaskAddress = await metaMaskSigner.getAddress();
    const checksumAddress = utils.getAddress(metaMaskAddress);

    this.setState({ account: checksumAddress });
    this.getMetaMaskNetwork();
    this.checkAddressMatches(checksumAddress);
  }

  private async getMetaMaskNetwork() {
    if (!metaMaskProvider) {
      return;
    }

    const metaMaskNetwork = await metaMaskProvider.getNetwork();

    this.setState({ network: metaMaskNetwork.chainId });
    this.checkNetworkMatches(metaMaskNetwork);
  }

  private checkAddressMatches(metaMaskAddress: string) {
    const desiredAddress = utils.getAddress(this.props.transactionFields.account.address);
    this.setState({ accountMatches: metaMaskAddress === desiredAddress });
  }

  private checkNetworkMatches(metaMaskNetwork: ethers.utils.Network) {
    const getMetaMaskNetworkbyChainId = getNetworkByChainId(metaMaskNetwork.chainId.toString());
    if (!getMetaMaskNetworkbyChainId) {
      return;
    }

    const localCacheSenderNetwork = this.props.transactionFields.account.network;
    if (getMetaMaskNetworkbyChainId.name === localCacheSenderNetwork) {
      this.setState({ networkMatches: true });
      this.maybeSendTransaction();
    } else {
      this.setState({ networkMatches: false });
    }
  }

  private watchForAccountChanges(ethereum: NonNullable<Window['ethereum']>) {
    ethereum.on('accountsChanged', this.getMetaMaskAccount);
  }

  private async maybeSendTransaction() {
    if (!this.state.accountMatches || !this.state.networkMatches) {
      return;
    }

    this.setState({ walletState: WalletSigningState.READY });
    const signerWallet = metaMaskProvider.getSigner();

    try {
      const receipt = await signerWallet.sendTransaction(transaction);
      this.props.onNext(receipt);
    } catch (err) {
      if (err.message.includes('User denied transaction signature')) {
        this.setState({ walletState: WalletSigningState.NOT_READY });
      }
    }
  }
}

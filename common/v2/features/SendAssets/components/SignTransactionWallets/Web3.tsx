import React, { Component } from 'react';
import { ethers, utils } from 'ethers';
import { Web3Provider } from 'ethers/providers/web3-provider';

import { getNetworkByChainId } from 'v2/services/Store';
import './Web3.scss';
import { ISignComponentProps } from '../../types';
import { getWeb3Config } from 'v2/utils/web3';

declare global {
  interface Window {
    ethereum?: any;
    web3: any;
    Web3Provider: ethers.providers.Web3Provider;
    Web3Signer: Web3Provider;
  }
}

enum WalletSigningState {
  READY, //when signerWallet is ready to sendTransaction
  NOT_READY, //use when signerWallet rejects transaction
  UNKNOWN //used upon component initialization when wallet status is not determined
}

interface Web3UserState {
  account: string | undefined;
  network: number | undefined;
  accountMatches: boolean;
  networkMatches: boolean;
  submitting: boolean;
  walletState: WalletSigningState;
}

const ethereumProvider = window.ethereum;
let web3Provider: ethers.providers.Web3Provider;

async function getWeb3Provider() {
  await ethereumProvider.enable();
  return new ethers.providers.Web3Provider(ethereumProvider);
}

export default class SignTransactionWeb3 extends Component<ISignComponentProps, Web3UserState> {
  public state: Web3UserState = {
    account: undefined,
    network: undefined,
    accountMatches: false,
    networkMatches: false,
    submitting: false,
    walletState: WalletSigningState.UNKNOWN
  };

  constructor(props: ISignComponentProps) {
    super(props);
    this.getWeb3Account = this.getWeb3Account.bind(this);
  }

  public async initProvider() {
    web3Provider = await getWeb3Provider();

    if (ethereumProvider) {
      this.getWeb3Account();
      this.watchForAccountChanges(ethereumProvider);
    } else {
      throw Error('No web3 found');
    }
  }

  public componentWillMount() {
    this.initProvider();
  }

  public render() {
    const { senderAccount, rawTransaction } = this.props;
    const networkName = rawTransaction.chainId; // @TODO get networkName
    const walletConfig = getWeb3Config();
    const { accountMatches, networkMatches, walletState, submitting } = this.state;

    return (
      <>
        <div className="SignTransactionWeb3-title">{`Sign the Transaction with ${walletConfig.name}`}</div>
        <div className="SignTransactionWeb3-instructions">
          {`Sign into ${walletConfig.name} on your computer and follow the instructions in the ${walletConfig.name} window.`}
        </div>
        <div className="SignTransactionWeb3-img">
          <img src={walletConfig.icon} />
        </div>
        {walletState === WalletSigningState.NOT_READY ? (
          <div className="SignTransactionWeb3-rejection">
            Transaction has been rejected or there was an error. Please restart send-flow
          </div>
        ) : null}

        <div className="SignTransactionWeb3-input">
          <div className="SignTransactionWeb3-errors">
            {!networkMatches && (
              <div className="SignTransactionWeb3-wrong-network">
                {`Please switch the network in ${walletConfig.name} to ${networkName}`}
              </div>
            )}
            {!accountMatches && (
              <div className="SignTransactionWeb3-wrong-address">
                {`Please switch the account in ${walletConfig.name} to
                ${senderAccount.address} in order to proceed`}
              </div>
            )}
          </div>
          {submitting && <div>Submitting transaction now.</div>}
          <div className="SignTransactionWeb3-description">
            Because we never save, store, or transmit your secret, you need to sign each transaction
            in order to send it. MyCrypto puts YOU in control of your assets.
          </div>
          <div className="SignTransactionWeb3-footer">
            <div className="SignTransactionWeb3-help">
              Not working? Here's some troubleshooting tips to try
            </div>
          </div>
        </div>
      </>
    );
  }

  private async getWeb3Account() {
    if (!Web3Provider) {
      return;
    }

    const web3Signer = web3Provider.getSigner();
    const web3Address = await web3Signer.getAddress();
    const checksumAddress = utils.getAddress(web3Address);

    this.setState({ account: checksumAddress });
    this.getWeb3Network();
    this.checkAddressMatches(checksumAddress);
  }

  private async getWeb3Network() {
    if (!Web3Provider) {
      return;
    }

    const web3Network = await web3Provider.getNetwork();
    this.setState({ network: web3Network.chainId });
    this.checkNetworkMatches(web3Network);
  }

  private checkAddressMatches(Web3Address: string) {
    const { senderAccount } = this.props;
    const desiredAddress = utils.getAddress(senderAccount.address);
    this.setState({ accountMatches: Web3Address === desiredAddress });
  }

  private checkNetworkMatches(Web3Network: ethers.utils.Network) {
    const { name: networkName } = this.props.network;
    const getWeb3NetworkbyChainId = getNetworkByChainId(Web3Network.chainId);
    if (!getWeb3NetworkbyChainId) {
      return;
    }

    const localCacheSenderNetwork = networkName;
    if (getWeb3NetworkbyChainId.name === localCacheSenderNetwork) {
      this.setState({ networkMatches: true });
      this.maybeSendTransaction();
    } else {
      this.setState({ networkMatches: false });
    }
  }

  private watchForAccountChanges(ethereum: NonNullable<Window['ethereum']>) {
    ethereum.on('accountsChanged', this.getWeb3Account);
  }

  private async maybeSendTransaction() {
    const { rawTransaction, onSuccess } = this.props;
    this.setState({ submitting: true });
    if (!this.state.accountMatches || !this.state.networkMatches) {
      return;
    }

    this.setState({ walletState: WalletSigningState.READY });
    const signerWallet = web3Provider.getSigner();

    try {
      signerWallet.sendUncheckedTransaction(rawTransaction).then(txHash => {
        web3Provider.getTransactionReceipt(txHash).then(output => {
          this.setState({ submitting: false });
          onSuccess(output !== null ? output : txHash);
        });
      });
    } catch (err) {
      console.debug(`[SignTransactionWeb3] ${err}`);
      if (err.message.includes('User denied transaction signature')) {
        this.setState({ walletState: WalletSigningState.NOT_READY });
      }
    }
  }
}

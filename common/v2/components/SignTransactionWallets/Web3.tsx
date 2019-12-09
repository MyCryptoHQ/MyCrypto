import React, { Component } from 'react';
import { ethers, utils } from 'ethers';
import { Web3Provider } from 'ethers/providers/web3-provider';

import { WALLETS_CONFIG } from 'v2/config';
import { ISignComponentProps } from 'v2/types';
import translate, { translateRaw } from 'v2/translations';
import { getWeb3Config } from 'v2/utils/web3';
import { getNetworkByChainId } from 'v2/services/Store';
import './Web3.scss';

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
    const detectedNetwork = getNetworkByChainId(rawTransaction.chainId);
    const networkName = detectedNetwork ? detectedNetwork.name : 'Unknown Network';
    const walletConfig = getWeb3Config();
    const { accountMatches, networkMatches, walletState, submitting } = this.state;

    return (
      <>
        <div className="SignTransactionWeb3-title">
          {translate('SIGN_TX_TITLE', {
            $walletName: walletConfig.name || WALLETS_CONFIG.WEB3.name
          })}
        </div>
        <div className="SignTransactionWeb3-instructions">
          {translate('SIGN_TX_WEB3_PROMPT', {
            $walletName: walletConfig.name || WALLETS_CONFIG.WEB3.name
          })}
        </div>
        <div className="SignTransactionWeb3-img">
          <img src={walletConfig.icon} />
        </div>
        {walletState === WalletSigningState.NOT_READY ? (
          <div className="SignTransactionWeb3-rejection">{translate('SIGN_TX_WEB3_REJECTED')}</div>
        ) : null}

        <div className="SignTransactionWeb3-input">
          <div className="SignTransactionWeb3-errors">
            {!networkMatches && (
              <div className="SignTransactionWeb3-wrong-network">
                {translate('SIGN_TX_WEB3_FAILED_NETWORK', {
                  $walletName: walletConfig.name,
                  $networkName: networkName
                })}
              </div>
            )}
            {!accountMatches && (
              <div className="SignTransactionWeb3-wrong-address">
                {translate('SIGN_TX_WEB3_FAILED_ACCOUNT', {
                  $walletName: walletConfig.name,
                  $address: senderAccount.address
                })}
              </div>
            )}
          </div>
          {submitting && translate('SIGN_TX_SUBMITTING_PENDING')}
          <div className="SignTransactionWeb3-description">
            {translateRaw('SIGN_TX_EXPLANATION')}
          </div>
          <div className="SignTransactionWeb3-footer">
            {walletConfig.helpLink && (
              <div className="SignTransactionWeb3-help">
                {translate('SIGN_TX_HELP_LINK', { $helpLink: walletConfig.helpLink })}
              </div>
            )}
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

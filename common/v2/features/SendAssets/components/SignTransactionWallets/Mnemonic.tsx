import React, { Component } from 'react';

import PrivateKeyicon from 'common/assets/images/icn-privatekey-new.svg';
import { ISignComponentProps } from '../../types';
import { translateRaw } from 'translations';
import { Spinner } from 'v2/components/Spinner';
import { Input } from 'components/ui';
import { ethers, utils } from 'ethers';
import { isValidMnemonic } from 'ethers/utils/hdnode';

interface MnemonicValueState {
  seed: string;
  phrase: string;
  pass: string;
  selectedDPath: string;
  walletState: WalletSigningState;
  isSigning: boolean;
}

enum WalletSigningState {
  READY, //when signerWallet is ready to sendTransaction
  NOT_READY, //use when signerWallet rejects transaction
  UNKNOWN //used upon component initialization when wallet status is not determined
}

export default class SignTransactionMnemonic extends Component<
  ISignComponentProps,
  MnemonicValueState
> {
  public state: MnemonicValueState = {
    seed: '',
    phrase: '',
    pass: '',
    selectedDPath: '',
    walletState: WalletSigningState.UNKNOWN,
    isSigning: false
  };

  public render() {
    const isWalletPending = false;
    const { phrase, pass, walletState, isSigning } = this.state;

    const unlockDisabled = !phrase;

    return (
      <div className="SignTransaction-panel">
        <div className="SignTransactionKeystore-title">
          Sign the Transaction with your Mnemonic Phrase
        </div>
        <div className="Keystore">
          <form onSubmit={this.unlock}>
            <div className="Keystore-form">
              <div className="SignTransactionKeystore-img">
                <img src={PrivateKeyicon} />
              </div>

              {walletState === WalletSigningState.NOT_READY ? (
                <div className="SignTransactionKeystore-error">
                  The input Mnemonic Phrase's Public Address does not match Account's sender
                  Address, please try again.
                </div>
              ) : null}
              <label>Your Mnemonic Phrase</label>
              <Input
                isValid={phrase && phrase.length > 0 ? isValidMnemonic(phrase) : false}
                type="text"
                onChange={this.handleMnemonicEnter}
                placeholder="please enter mnemonic phrase"
                value={phrase}
              />

              <label className="SignTransactionKeystore-password">Your Password</label>
              <Input
                isValid={pass ? pass.length > 0 : false}
                className={`${phrase.length && isWalletPending ? 'hidden' : ''}`}
                disabled={!phrase}
                value={pass}
                onChange={this.onPasswordChange}
                onKeyDown={this.onKeyDown}
                placeholder={translateRaw('INPUT_PASSWORD_LABEL')}
                type="password"
              />
            </div>
            <div className="SignTransactionKeystore-description">
              Because we never save, store, or transmit your secret, you need to sign each
              transaction in order to send it. MyCrypto puts YOU in control of your assets.
            </div>
            <div className="SignTransactionKeystore-spinner">
              {isSigning ? (
                <Spinner />
              ) : (
                <button className="btn btn-primary btn-block" disabled={unlockDisabled}>
                  Sign Transaction
                </button>
              )}
            </div>
          </form>
          <div className="SignTransactionKeystore-help">
            Not working? Here's some troubleshooting tips to try.
          </div>
        </div>
      </div>
    );
  }

  private onKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      this.unlock(e);
    }
  };

  private unlock = async (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.getPublicKey();
  };

  private async getPublicKey() {
    this.setState({ isSigning: true });
    try {
      const wallet = await ethers.Wallet.fromMnemonic(this.state.phrase, this.state.selectedDPath);
      const checkSumAddress = utils.getAddress(wallet.address);
      this.checkPublicKeyMatchesCache(checkSumAddress);
    } catch (err) {
      console.error(err);
    }
  }

  private checkPublicKeyMatchesCache(walletAddres: string) {
    const { senderAccount } = this.props;
    const localCacheAddress = utils.getAddress(senderAccount.address);
    const mnemonicAddress = walletAddres;

    if (localCacheAddress === mnemonicAddress) {
      this.setState({ walletState: WalletSigningState.READY });
      this.signTransaction();
    } else {
      this.setState({ walletState: WalletSigningState.NOT_READY });
      throw new Error('Incorrect Mnemonic Phrase or DPath');
    }
  }

  private async signTransaction() {
    const { rawTransaction } = this.props;

    const signerWallet = await ethers.Wallet.fromMnemonic(
      this.state.phrase,
      this.state.selectedDPath
    );
    const rawSignedTransaction: any = await signerWallet.sign(rawTransaction);
    this.props.onSuccess(rawSignedTransaction);
  }
  private onPasswordChange = (e: any) => {
    this.setState({
      pass: e.target.value
    });
  };

  private handleMnemonicEnter = (e: any) => {
    this.setState({
      phrase: e.target.value
    });
  };
}

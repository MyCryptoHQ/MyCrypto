import React, { Component } from 'react';
import { ethers, utils } from 'ethers';
import { isValidMnemonic } from 'ethers/utils/hdnode';
import styled from 'styled-components';

import { ISignComponentProps } from '@types';
import translate, { translateRaw } from '@translations';
import { Button, Input } from '@components';
import { WALLETS_CONFIG } from '@config';

import PrivateKeyicon from '@assets/images/icn-privatekey-new.svg';

interface MnemonicValueState {
  seed: string;
  phrase: string;
  pass: string;
  walletState: WalletSigningState;
  isSigning: boolean;
}

enum WalletSigningState {
  READY, //when signerWallet is ready to sendTransaction
  NOT_READY, //use when signerWallet rejects transaction
  UNKNOWN //used upon component initialization when wallet status is not determined
}

const SignButton = styled(Button)`
  width: 100%;

  > div {
    justify-content: center;
  }
`;

export default class SignTransactionMnemonic extends Component<
  ISignComponentProps,
  MnemonicValueState
> {
  public state: MnemonicValueState = {
    seed: '',
    phrase: '',
    pass: '',
    walletState: WalletSigningState.UNKNOWN,
    isSigning: false
  };

  public render() {
    const isWalletPending = false;
    const { phrase, pass, walletState, isSigning } = this.state;

    const unlockDisabled = !phrase;

    return (
      <>
        <div className="SignTransactionKeystore-title">
          {translate('SIGN_TX_TITLE', { $walletName: WALLETS_CONFIG.MNEMONIC_PHRASE.name })}
        </div>
        <div className="Keystore">
          <form onSubmit={this.unlock}>
            <div className="Keystore-form">
              <div className="SignTransactionKeystore-img">
                <img src={PrivateKeyicon} />
              </div>

              {walletState === WalletSigningState.NOT_READY ? (
                <div className="SignTransactionKeystore-error">
                  {translateRaw('MNEMONIC_PHRASE_PUBLIC_ADDRESS_NOT_MATCH_ACCOUNT')}
                </div>
              ) : null}
              <label>{translate('SIGN_TX_YOUR_WALLET', { $walletName: 'Mnemonic Phrase' })}</label>
              <Input
                isValid={phrase && phrase.length > 0 ? isValidMnemonic(phrase) : false}
                type="text"
                onChange={this.handleMnemonicEnter}
                placeholder={translateRaw('MNEMONIC_ENTER_PHRASE')}
                value={phrase}
              />

              <label className="SignTransactionKeystore-password">
                {translateRaw('SIGN_TX_YOUR_PASSWORD')}
              </label>
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
              {translateRaw('SIGN_TX_EXPLANATION')}
            </div>
            <SignButton type="submit" disabled={unlockDisabled} loading={isSigning}>
              {translateRaw('DEP_SIGNTX')}
            </SignButton>
          </form>
          {WALLETS_CONFIG.MNEMONIC_PHRASE.helpLink && (
            <div className="SignTransactionKeystore-help">
              {translate('SIGN_TX_HELP_LINK', {
                $helpLink: WALLETS_CONFIG.MNEMONIC_PHRASE.helpLink
              })}
            </div>
          )}
        </div>
      </>
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
    await this.getPublicKey();
  };

  private async getPublicKey() {
    this.setState({ isSigning: true });
    try {
      const { senderAccount } = this.props;
      const wallet = await ethers.Wallet.fromMnemonic(this.state.phrase, senderAccount.dPath);
      const checkSumAddress = utils.getAddress(wallet.address);
      this.checkPublicKeyMatchesCache(checkSumAddress);
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ isSigning: false });
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
    const { rawTransaction, senderAccount } = this.props;

    const signerWallet = await ethers.Wallet.fromMnemonic(this.state.phrase, senderAccount.dPath);
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

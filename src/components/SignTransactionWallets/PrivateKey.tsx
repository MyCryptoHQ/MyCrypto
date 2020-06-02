import React, { Component } from 'react';
import { stripHexPrefix } from 'ethjs-util';
import { ethers } from 'ethers';

import { TogglablePassword, Input, Button } from '@components';
import { isValidPrivKey, isValidEncryptedPrivKey } from '@services/EthService';
import { decryptPrivKey } from '@services/EthService/utils';
import { ISignComponentProps } from '@types';
import translate, { translateRaw } from '@translations';
import { WALLETS_CONFIG } from '@config';

import './PrivateKey.scss';
import PrivateKeyicon from '@assets/images/icn-privatekey-new.svg';

export interface SignWithPrivKeyState {
  key: string;
  password: string;
  valid: boolean;
}

interface Validated {
  fixedPkey: string;
  isValidPkey: boolean;
  isPassRequired: boolean;
  valid: boolean;
}

function validatePkeyAndPass(pkey: string, pass: string): Validated {
  const fixedPkey = stripHexPrefix(pkey).trim();
  const validPkey = isValidPrivKey(fixedPkey);
  const validEncPkey = isValidEncryptedPrivKey(fixedPkey);
  const isValidPkey = validPkey || validEncPkey;

  let isValidPass = false;

  if (validPkey) {
    isValidPass = true;
  } else if (validEncPkey) {
    isValidPass = pass.length > 0;
  }

  return {
    fixedPkey,
    isValidPkey,
    isPassRequired: validEncPkey,
    valid: isValidPkey && isValidPass
  };
}

export default class SignTransactionPrivateKey extends Component<
  ISignComponentProps,
  SignWithPrivKeyState
> {
  public state = {
    key: '',
    password: '',
    valid: false
  };
  public render() {
    const { key, password } = this.state;
    const { isValidPkey, isPassRequired } = validatePkeyAndPass(key, password);
    return (
      <>
        <div className="SignTransactionPrivateKey-title">
          {translate('SIGN_TX_TITLE', { $walletName: WALLETS_CONFIG.PRIVATE_KEY.name })}
        </div>
        <div
          className={'SignTransactionPrivateKey-' + (isPassRequired ? 'with-pass' : 'without-pass')}
        >
          <div className="SignTransactionPrivateKey-img">
            <img src={PrivateKeyicon} />
          </div>
          <div className="SignTransactionPrivateKey-input">
            <label className="SignTransactionPrivateKey-label">
              {translate('SIGN_TX_YOUR_WALLET', { $walletName: WALLETS_CONFIG.PRIVATE_KEY.name })}
            </label>
            <TogglablePassword
              value={key}
              isValid={isValidPkey}
              placeholder={translateRaw('PRIVATE_KEY_PLACEHOLDER')}
              onChange={this.onPkeyChange}
              onEnter={() => this.unlock}
            />

            {isValidPkey && isPassRequired && (
              <label className="SignTransactionPrivateKey-label">
                {translateRaw('SIGN_TX_YOUR_PASSWORD')}
                <Input
                  isValid={password.length > 0}
                  value={password}
                  onChange={this.onPasswordChange}
                  onKeyDown={this.onKeyDown}
                  placeholder={translateRaw('INPUT_PASSWORD_LABEL')}
                  type="password"
                />
              </label>
            )}
          </div>
          <div className="SignTransactionPrivateKey-description">
            {translateRaw('SIGN_TX_EXPLANATION')}
          </div>
          <div className="SignTransactionPrivateKey-footer">
            <Button onClick={this.unlock} className="SignTransactionPrivateKey-button">
              {translateRaw('DEP_SIGNTX')}
            </Button>
            {WALLETS_CONFIG.PRIVATE_KEY.helpLink && (
              <div className="SignTransactionPrivateKey-help">
                {translate('SIGN_TX_HELP_LINK', { $helpLink: WALLETS_CONFIG.PRIVATE_KEY.helpLink })}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  private onPkeyChange = (e: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const pkey = e.currentTarget.value;
    const pass = this.state.password;
    const { fixedPkey, valid } = validatePkeyAndPass(pkey, pass);

    this.setState({
      key: fixedPkey,
      valid
    });
  };

  private onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    // NOTE: Textareas don't support password type, so we replace the value
    // with an equal length number of dots. On change, we replace
    const pkey = this.state.key;
    const pass = e.currentTarget.value;
    const { valid } = validatePkeyAndPass(pkey, pass);

    this.setState({
      password: pass,
      valid
    });
  };

  private onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    console.debug(e);
  };

  private unlock = async (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { rawTransaction } = this.props;
    const { key, password } = this.state;

    const privateKey = password.length > 0 ? decryptPrivKey(key, password) : key;

    const signerWallet = new ethers.Wallet(privateKey);
    const rawSignedTransaction: any = await signerWallet.sign(rawTransaction);
    this.props.onSuccess(rawSignedTransaction);
  };
}

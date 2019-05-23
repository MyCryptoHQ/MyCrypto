import React, { Component } from 'react';
import './PrivateKey.scss';
import { Button } from '@mycrypto/ui';
import PrivateKeyicon from 'common/assets/images/icn-privatekey-new.svg';

import { TogglablePassword } from 'components';
import { stripHexPrefix } from 'ethjs-util';
import { isValidPrivKey, isValidEncryptedPrivKey } from 'libs/validators';
import { Input } from 'components/ui';

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

export default class SignTransactionPrivateKey extends Component {
  public state: SignWithPrivKeyState = {
    key: '',
    password: '',
    valid: false
  };
  public render() {
    const { key, password } = this.state;
    const { isValidPkey } = validatePkeyAndPass(key, password);
    return (
      <div className="SignTransactionPrivateKey-panel">
        <div className="SignTransactionPrivateKey-title">
          Sign the Transaction with your Private Key
        </div>
        <div className="SignTransactionPrivateKey-content">
          <div className="SignTransactionPrivateKey-img">
            <img src={PrivateKeyicon} />
          </div>
          <div className="SignTransactionPrivateKey-input">
            <label className="SignTransactionPrivateKey-label">Your Private Key</label>
            <TogglablePassword value={key} isValid={isValidPkey} placeholder="Private Key" />
            <label className="SignTransactionPrivateKey-label">Your Password</label>
            <Input
              isValid={password.length > 0}
              value={password}
              onChange={this.onPasswordChange}
              onKeyDown={this.onKeyDown}
              placeholder="Password"
              type="password"
            />
          </div>
          <div className="SignTransactionPrivateKey-description">
            Because we never save, store, or transmit your secret, you need to sign each transaction
            in order to send it. MyCyrpto puts YOU in control of your assets.
          </div>
          <div className="SignTransactionPrivateKey-footer">
            <Button className="SignTransactionPrivateKey-button"> Sign Transaction</Button>
            <div className="SignTransactionPrivateKey-help">
              Not working? Here's some troubleshooting tips to try
            </div>
          </div>
        </div>
      </div>
    );
  }

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
    console.log(e);
  };
}

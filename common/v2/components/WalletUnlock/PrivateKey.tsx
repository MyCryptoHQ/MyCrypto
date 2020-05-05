import React, { PureComponent } from 'react';

import translate, { translateRaw } from 'v2/translations';
import { TogglablePassword, Input } from 'v2/components';

import { WalletId } from 'v2/types';
import { isValidEncryptedPrivKey, isValidPrivKey, stripHexPrefix } from 'v2/services/EthService';
import { WalletFactory } from 'v2/services/WalletService';
import PrivateKeyicon from 'common/assets/images/icn-privatekey-new.svg';
import './PrivateKey.scss';

export interface PrivateKeyValue {
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

interface Props {
  wallet: any;
  onChange(value: PrivateKeyValue): void;
  onUnlock(param: any): void;
}

const WalletService = WalletFactory(WalletId.PRIVATE_KEY);
export class PrivateKeyDecrypt extends PureComponent<Props> {
  public state: PrivateKeyValue = {
    key: '',
    password: '',
    valid: false
  };

  public render() {
    const { wallet } = this.props;
    const { key, password } = this.state;
    const { isValidPkey, isPassRequired } = validatePkeyAndPass(key, password);
    const unlockDisabled = !isValidPkey || (isPassRequired && !password.length);

    return (
      <div className="Panel">
        <div className="Panel-title">
          {translate('UNLOCK_WALLET')}{' '}
          {translateRaw('YOUR_WALLET_TYPE', { $walletType: translateRaw(wallet.lid) })}
        </div>
        <div className="PrivateKey">
          <form id="selectedTypeKey" onSubmit={this.unlock}>
            <div className="PrivateKey-img">
              <img src={PrivateKeyicon} />
            </div>

            <div className="input-group-wrapper">
              <label className="input-group">
                <label className="PrivateKey-label">{translateRaw('YOUR_PRIVATE_KEY')}</label>
                <TogglablePassword
                  value={key}
                  rows={4}
                  placeholder={translateRaw('X_PRIVKEY2')}
                  isValid={isValidPkey}
                  onChange={this.onPkeyChange}
                  onEnter={() => this.unlock}
                />
              </label>
            </div>
            {isValidPkey && isPassRequired && (
              <div className="input-group-wrapper">
                <label className="input-group">
                  <div className="input-group-header">{translate('ADD_LABEL_3')}</div>

                  <Input
                    isValid={password.length > 0}
                    value={password}
                    onChange={this.onPasswordChange}
                    onKeyDown={this.onKeyDown}
                    placeholder={translateRaw('INPUT_PASSWORD_LABEL')}
                    type="password"
                  />
                </label>
              </div>
            )}
            <button className="btn btn-block btn-primary" disabled={unlockDisabled}>
              {translate('ADD_LABEL_6_SHORT')}
            </button>
          </form>
          <div className="PrivateKey-help">{translate('PRIVATE_KEY_HELP')}</div>
        </div>
      </div>
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
    if (e.keyCode === 13) {
      this.unlock(e);
    }
  };

  private unlock = async (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const wallet = await WalletService.init({
      key: this.state.key,
      password: this.state.password
    });
    this.props.onUnlock(wallet);
  };
}

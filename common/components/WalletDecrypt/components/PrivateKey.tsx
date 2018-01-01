import { isValidEncryptedPrivKey, isValidPrivKey } from 'libs/validators';
import { stripHexPrefix } from 'libs/values';
import React, { Component } from 'react';
import translate, { translateRaw } from 'translations';

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
  const fixedPkey = stripHexPrefix(pkey);
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
  value: PrivateKeyValue;
  onChange(value: PrivateKeyValue): void;
  onUnlock(): void;
}

export class PrivateKeyDecrypt extends Component<Props> {
  public render() {
    const { key, password } = this.props.value;
    const { isValidPkey, isPassRequired } = validatePkeyAndPass(key, password);
    const unlockDisabled = !isValidPkey || (isPassRequired && !password.length);

    return (
      <form id="selectedTypeKey" onSubmit={this.unlock}>
        <div className="form-group">
          <textarea
            id="aria-private-key"
            className={`form-control ${isValidPkey ? 'is-valid' : 'is-invalid'}`}
            value={key}
            onChange={this.onPkeyChange}
            onKeyDown={this.onKeyDown}
            placeholder={translateRaw('x_PrivKey2')}
            rows={4}
          />
        </div>
        {isValidPkey &&
          isPassRequired && (
            <div className="form-group">
              <p>{translate('ADD_Label_3')}</p>
              <input
                className={`form-control ${password.length > 0 ? 'is-valid' : 'is-invalid'}`}
                value={password}
                onChange={this.onPasswordChange}
                onKeyDown={this.onKeyDown}
                placeholder={translateRaw('x_Password')}
                type="password"
              />
            </div>
          )}
        <button className="btn btn-block btn-primary" disabled={unlockDisabled}>
          {translate('ADD_Label_6_short')}
        </button>
      </form>
    );
  }

  public onPkeyChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const pkey = e.currentTarget.value;
    const pass = this.props.value.password;
    const { fixedPkey, valid } = validatePkeyAndPass(pkey, pass);

    this.props.onChange({ ...this.props.value, key: fixedPkey, valid });
  };

  public onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    const pkey = this.props.value.key;
    const pass = e.currentTarget.value;
    const { valid } = validatePkeyAndPass(pkey, pass);

    this.props.onChange({
      ...this.props.value,
      password: pass,
      valid
    });
  };

  public onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.keyCode === 13) {
      this.unlock(e);
    }
  };

  private unlock = (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onUnlock();
  };
}

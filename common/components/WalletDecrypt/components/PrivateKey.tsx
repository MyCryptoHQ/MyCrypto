import { isValidEncryptedPrivKey, isValidPrivKey } from 'libs/validators';
import { stripHexPrefix } from 'libs/values';
import React, { PureComponent } from 'react';
import translate, { translateRaw } from 'translations';
import { TogglablePassword } from 'components';
import { Input } from 'components/ui';

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
  value: PrivateKeyValue;
  onChange(value: PrivateKeyValue): void;
  onUnlock(): void;
}

export class PrivateKeyDecrypt extends PureComponent<Props> {
  public render() {
    const { key, password } = this.props.value;
    const { isValidPkey, isPassRequired } = validatePkeyAndPass(key, password);
    const unlockDisabled = !isValidPkey || (isPassRequired && !password.length);

    return (
      <form id="selectedTypeKey" onSubmit={this.unlock}>
        <div className="input-group-wrapper">
          <label className="input-group">
            <TogglablePassword
              value={key}
              rows={4}
              placeholder={translateRaw('x_PrivKey2')}
              isValid={isValidPkey}
              onChange={this.onPkeyChange}
              onEnter={this.props.onUnlock}
            />
          </label>
        </div>
        {isValidPkey &&
          isPassRequired && (
            <div className="input-group-wrapper">
              <label className="input-group">
                <div className="input-group-header">{translate('ADD_Label_3')}</div>
                <Input
                  className={`form-control ${password.length > 0 ? 'is-valid' : 'is-invalid'}`}
                  value={password}
                  onChange={this.onPasswordChange}
                  onKeyDown={this.onKeyDown}
                  placeholder={translateRaw('x_Password')}
                  type="password"
                />
              </label>
            </div>
          )}
        <button className="btn btn-block btn-primary" disabled={unlockDisabled}>
          {translate('ADD_Label_6_short')}
        </button>
      </form>
    );
  }

  private onPkeyChange = (e: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const pkey = e.currentTarget.value;
    const pass = this.props.value.password;
    const { fixedPkey, valid } = validatePkeyAndPass(pkey, pass);

    this.props.onChange({ ...this.props.value, key: fixedPkey, valid });
  };

  private onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    // NOTE: Textareas don't support password type, so we replace the value
    // with an equal length number of dots. On change, we replace
    const pkey = this.props.value.key;
    const pass = e.currentTarget.value;
    const { valid } = validatePkeyAndPass(pkey, pass);

    this.props.onChange({
      ...this.props.value,
      password: pass,
      valid
    });
  };

  private onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
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

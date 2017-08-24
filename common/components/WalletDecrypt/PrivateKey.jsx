// @flow
import React, { Component } from 'react';
import { isValidPrivKey, isValidEncryptedPrivKey } from 'libs/validators';
import { connect } from 'react-redux';
import { getLanguageSelection } from 'selectors/config';
import translate, { translateRaw } from 'translations';

export type PrivateKeyValue = {
  key: string,
  password: string,
  valid: boolean
};

function fixPkey(key) {
  if (key.indexOf('0x') === 0) {
    return key.slice(2);
  }
  return key;
}

type validated = {
  fixedPkey: string,
  isValidPkey: boolean,
  isPassRequired: boolean,
  valid: boolean
};

function validatePkeyAndPass(pkey: string, pass: string): validated {
  const fixedPkey = fixPkey(pkey);
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

class PrivateKeyDecrypt extends Component {
  props: {
    value: PrivateKeyValue,
    onChange: (value: PrivateKeyValue) => void,
    onUnlock: () => void,
    lang: string
  };

  render() {
    const { lang } = this.props;
    const { key, password } = this.props.value;
    const { isValidPkey, isPassRequired } = validatePkeyAndPass(key, password);

    return (
      <section className="col-md-4 col-sm-6">
        <div id="selectedTypeKey">
          <h4>
            {translate('ADD_Radio_3')}
          </h4>
          <div className="form-group">
            <textarea
              id="aria-private-key"
              className={`form-control ${isValidPkey
                ? 'is-valid'
                : 'is-invalid'}`}
              value={key}
              onChange={this.onPkeyChange}
              onKeyDown={this.onKeyDown}
              placeholder={translateRaw('x_PrivKey2', lang)}
              rows="4"
            />
          </div>
          {isValidPkey &&
            isPassRequired &&
            <div className="form-group">
              <p>
                {translate('ADD_Label_3')}
              </p>
              <input
                className={`form-control ${password.length > 0
                  ? 'is-valid'
                  : 'is-invalid'}`}
                value={password}
                onChange={this.onPasswordChange}
                onKeyDown={this.onKeyDown}
                placeholder={translateRaw('x_Password', lang)}
                type="password"
              />
            </div>}
        </div>
      </section>
    );
  }

  onPkeyChange = (e: SyntheticInputEvent) => {
    const pkey = e.target.value;
    const pass = this.props.value.password;
    const { fixedPkey, valid } = validatePkeyAndPass(pkey, pass);

    this.props.onChange({ ...this.props.value, key: fixedPkey, valid });
  };

  onPasswordChange = (e: SyntheticInputEvent) => {
    const pkey = this.props.value.key;
    const pass = e.target.value;
    const { valid } = validatePkeyAndPass(pkey, pass);

    this.props.onChange({
      ...this.props.value,
      password: pass,
      valid
    });
  };

  onKeyDown = (e: SyntheticKeyboardEvent) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      this.props.onUnlock();
    }
  };
}

function mapStateToProps(state) {
  return { lang: getLanguageSelection(state) };
}

export default connect(mapStateToProps)(PrivateKeyDecrypt);

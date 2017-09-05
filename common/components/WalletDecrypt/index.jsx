// @flow
import React, { Component } from 'react';
import translate from 'translations';
import KeystoreDecrypt from './Keystore';
import PrivateKeyDecrypt from './PrivateKey';
import type { PrivateKeyValue } from './PrivateKey';
import MnemonicDecrypt from './Mnemonic';
import LedgerNanoSDecrypt from './LedgerNano';
import TrezorDecrypt from './Trezor';
import ViewOnlyDecrypt from './ViewOnly';
import map from 'lodash/map';
import { unlockPrivateKey, unlockKeystore, setWallet } from 'actions/wallet';
import { connect } from 'react-redux';

const WALLETS = {
  'keystore-file': {
    lid: 'x_Keystore2',
    component: KeystoreDecrypt,
    initialParams: {
      file: '',
      password: ''
    },
    unlock: unlockKeystore
  },
  'private-key': {
    lid: 'x_PrivKey2',
    component: PrivateKeyDecrypt,
    initialParams: {
      key: '',
      password: ''
    },
    unlock: unlockPrivateKey
  },
  'mnemonic-phrase': {
    lid: 'x_Mnemonic',
    component: MnemonicDecrypt,
    disabled: true
  },
  'ledger-nano-s': {
    lid: 'x_Ledger',
    component: LedgerNanoSDecrypt,
    disabled: true
  },
  trezor: {
    lid: 'x_Trezor',
    component: TrezorDecrypt,
    initialParams: {},
    unlock: setWallet
  },
  'view-only': {
    lid: 'View with Address Only',
    component: ViewOnlyDecrypt,
    disabled: true
  }
};

type UnlockParams = {} | PrivateKeyValue;

type State = {
  selectedWalletKey: string,
  value: UnlockParams
};

export class WalletDecrypt extends Component {
  props: {
    // FIXME
    dispatch: (action: any) => void
  };
  state: State = {
    selectedWalletKey: 'keystore-file',
    value: WALLETS['keystore-file'].initialParams
  };

  getDecryptionComponent() {
    const { selectedWalletKey, value } = this.state;
    const selectedWallet = WALLETS[selectedWalletKey];

    if (!selectedWallet) {
      return null;
    }

    return (
      <selectedWallet.component
        value={value}
        onChange={this.onChange}
        onUnlock={this.onUnlock}
      />
    );
  }

  buildWalletOptions() {
    return map(WALLETS, (wallet, key) => {
      const isSelected = this.state.selectedWalletKey === key;

      return (
        <label className="radio" key={key}>
          <input
            aria-flowto={`aria-${key}`}
            aria-labelledby={`${key}-label`}
            type="radio"
            name="decryption-choice-radio-group"
            value={key}
            checked={isSelected}
            onChange={this.handleDecryptionChoiceChange}
            disabled={wallet.disabled}
          />
          <span id={`${key}-label`}>
            {translate(wallet.lid)}
          </span>
        </label>
      );
    });
  }

  handleDecryptionChoiceChange = (event: SyntheticInputEvent) => {
    const wallet = WALLETS[event.target.value];

    if (!wallet) {
      return;
    }

    this.setState({
      selectedWalletKey: event.target.value,
      value: wallet.initialParams
    });
  };

  render() {
    const decryptionComponent = this.getDecryptionComponent();

    return (
      <article className="Tab-content-pane row">
        <section className="col-md-4 col-sm-6">
          <h4>
            {translate('decrypt_Access')}
          </h4>

          {this.buildWalletOptions()}
        </section>

        {decryptionComponent}
        {!!this.state.value.valid &&
          <section className="col-md-4 col-sm-6">
            <h4 id="uploadbtntxt-wallet">
              {translate('ADD_Label_6')}
            </h4>
            <div className="form-group">
              <a
                tabIndex="0"
                role="button"
                className="btn btn-primary btn-block"
                onClick={this.onUnlock}
              >
                {translate('ADD_Label_6_short')}
              </a>
            </div>
          </section>}
      </article>
    );
  }

  onChange = (value: UnlockParams) => {
    this.setState({ value });
  };

  onUnlock = (payload: any) => {
    this.props.dispatch(
      WALLETS[this.state.selectedWalletKey].unlock(this.state.value || payload)
    );
  };
}

export default connect()(WalletDecrypt);

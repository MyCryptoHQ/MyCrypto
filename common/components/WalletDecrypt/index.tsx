import {
  setWallet,
  unlockKeystore,
  UnlockKeystoreAction,
  unlockMnemonic,
  UnlockMnemonicAction,
  unlockPrivateKey,
  UnlockPrivateKeyAction,
  unlockWeb3
} from 'actions/wallet';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import translate from 'translations';
import KeystoreDecrypt from './Keystore';
import LedgerNanoSDecrypt from './LedgerNano';
import MnemonicDecrypt from './Mnemonic';
import PrivateKeyDecrypt, { PrivateKeyValue } from './PrivateKey';
import TrezorDecrypt from './Trezor';
import ViewOnlyDecrypt from './ViewOnly';
import { AppState } from 'reducers';
import Web3Decrypt from './Web3';
import Help from 'components/ui/Help';

const WALLETS = {
  web3: {
    lid: 'x_MetaMask',
    component: Web3Decrypt,
    initialParams: {},
    unlock: unlockWeb3,
    helpLink:
      'https://myetherwallet.github.io/knowledge-base/migration/moving-from-private-key-to-metamask.html'
  },
  'ledger-nano-s': {
    lid: 'x_Ledger',
    component: LedgerNanoSDecrypt,
    initialParams: {},
    unlock: setWallet,
    helpLink:
      'https://ledger.zendesk.com/hc/en-us/articles/115005200009-How-to-use-MyEtherWallet-with-Ledger'
  },
  trezor: {
    lid: 'x_Trezor',
    component: TrezorDecrypt,
    initialParams: {},
    unlock: setWallet,
    helpLink: 'https://doc.satoshilabs.com/trezor-apps/mew.html'
  },
  'keystore-file': {
    lid: 'x_Keystore2',
    component: KeystoreDecrypt,
    initialParams: {
      file: '',
      password: ''
    },
    unlock: unlockKeystore,
    helpLink:
      'https://myetherwallet.github.io/knowledge-base/private-keys-passwords/difference-beween-private-key-and-keystore-file.html'
  },
  'mnemonic-phrase': {
    lid: 'x_Mnemonic',
    component: MnemonicDecrypt,
    initialParams: {},
    unlock: unlockMnemonic,
    helpLink:
      'https://myetherwallet.github.io/knowledge-base/private-keys-passwords/difference-beween-private-key-and-keystore-file.html'
  },
  'private-key': {
    lid: 'x_PrivKey2',
    component: PrivateKeyDecrypt,
    initialParams: {
      key: '',
      password: ''
    },
    unlock: unlockPrivateKey,
    helpLink:
      'https://myetherwallet.github.io/knowledge-base/private-keys-passwords/difference-beween-private-key-and-keystore-file.html'
  },
  'view-only': {
    lid: 'View with Address Only',
    component: ViewOnlyDecrypt,
    initialParams: {},
    unlock: setWallet,
    helpLink: ''
  }
};

type UnlockParams = {} | PrivateKeyValue;

interface Props {
  // FIXME
  dispatch: Dispatch<
    UnlockKeystoreAction | UnlockMnemonicAction | UnlockPrivateKeyAction
  >;
  offline: boolean;
  allowReadOnly?: boolean;
}

interface State {
  selectedWalletKey: string;
  value: UnlockParams;
}

export class WalletDecrypt extends Component<Props, State> {
  public state: State = {
    selectedWalletKey: 'keystore-file',
    value: WALLETS['keystore-file'].initialParams
  };

  public getDecryptionComponent() {
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

  public isOnlineRequiredWalletAndOffline(selectedWalletKey) {
    const onlineRequiredWallets = ['trezor', 'ledger-nano-s'];
    return (
      this.props.offline && onlineRequiredWallets.includes(selectedWalletKey)
    );
  }

  public buildWalletOptions() {
    return map(WALLETS, (wallet, key) => {
      const { helpLink } = wallet;
      const isSelected = this.state.selectedWalletKey === key;
      const isDisabled =
        this.isOnlineRequiredWalletAndOffline(key) ||
        (!this.props.allowReadOnly && wallet.component === ViewOnlyDecrypt);

      return (
        <label className="radio" key={key}>
          <input
            aria-flowto={`aria-${key}`}
            aria-labelledby={`${key}-label`}
            type="radio"
            name="decryption-choice-radio-group"
            value={key}
            checked={isSelected}
            disabled={isDisabled}
            onChange={this.handleDecryptionChoiceChange}
          />
          <span id={`${key}-label`}>{translate(wallet.lid)}</span>
          {helpLink ? <Help link={helpLink} /> : null}
        </label>
      );
    });
  }

  public handleDecryptionChoiceChange = (
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const wallet = WALLETS[(event.target as HTMLInputElement).value];

    if (!wallet) {
      return;
    }

    this.setState({
      selectedWalletKey: (event.target as HTMLInputElement).value,
      value: wallet.initialParams
    });
  };

  public render() {
    const decryptionComponent = this.getDecryptionComponent();

    return (
      <article className="Tab-content-pane row">
        <section className="col-md-4 col-sm-6">
          <h4>{translate('decrypt_Access')}</h4>

          {this.buildWalletOptions()}
        </section>

        {decryptionComponent}
        {!!(this.state.value as PrivateKeyValue).valid && (
          <section className="col-md-4 col-sm-6">
            <h4 id="uploadbtntxt-wallet">{translate('ADD_Label_6')}</h4>
            <div className="form-group">
              <a
                tabIndex={0}
                role="button"
                className="btn btn-primary btn-block"
                onClick={this.onUnlock}
              >
                {translate('ADD_Label_6_short')}
              </a>
            </div>
          </section>
        )}
      </article>
    );
  }

  public onChange = (value: UnlockParams) => {
    this.setState({ value });
  };

  public onUnlock = (payload: any) => {
    // some components (TrezorDecrypt) don't take an onChange prop, and thus this.state.value will remain unpopulated.
    // in this case, we can expect the payload to contain the unlocked wallet info.
    const unlockValue =
      this.state.value && !isEmpty(this.state.value)
        ? this.state.value
        : payload;
    this.props.dispatch(
      WALLETS[this.state.selectedWalletKey].unlock(unlockValue)
    );
  };
}

function mapStateToProps(state: AppState) {
  return {
    offline: state.config.offline
  };
}

export default connect(mapStateToProps)(WalletDecrypt);

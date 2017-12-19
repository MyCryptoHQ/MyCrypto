import {
  setWallet,
  TSetWallet,
  unlockKeystore,
  TUnlockKeystore,
  unlockMnemonic,
  TUnlockMnemonic,
  unlockPrivateKey,
  TUnlockPrivateKey,
  unlockWeb3,
  TUnlockWeb3,
  resetWallet,
  TResetWallet
} from 'actions/wallet';
import { reset, TReset } from 'actions/transaction';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import translate from 'translations';
import {
  DigitalBitboxDecrypt,
  KeystoreDecrypt,
  LedgerNanoSDecrypt,
  MnemonicDecrypt,
  PrivateKeyDecrypt,
  PrivateKeyValue,
  TrezorDecrypt,
  ViewOnlyDecrypt,
  Web3Decrypt,
  NavigationPrompt
} from './components';
import { AppState } from 'reducers';
import { NewTabLink } from 'components/ui';
import { knowledgeBaseURL } from 'config/data';
import { IWallet } from 'libs/wallet';
import DigitalBitboxIcon from 'assets/images/wallets/digital-bitbox.svg';
import LedgerIcon from 'assets/images/wallets/ledger.svg';
import MetamaskIcon from 'assets/images/wallets/metamask.svg';
import MistIcon from 'assets/images/wallets/mist.svg';
import TrezorIcon from 'assets/images/wallets/trezor.svg';
import './WalletDecrypt.scss';

type UnlockParams = {} | PrivateKeyValue;

interface Props {
  resetTransactionState: TReset;
  unlockKeystore: TUnlockKeystore;
  unlockMnemonic: TUnlockMnemonic;
  unlockPrivateKey: TUnlockPrivateKey;
  setWallet: TSetWallet;
  unlockWeb3: TUnlockWeb3;
  resetWallet: TResetWallet;
  wallet: IWallet;
  hidden?: boolean;
  offline: boolean;
  allowReadOnly?: boolean;
}

interface State {
  selectedWalletKey: string | null;
  value: UnlockParams | null;
}

interface BaseWalletInfo {
  lid: string;
  component: React.ComponentClass;
  initialParams: object;
  unlock: any;
  helpLink?: string;
}

export interface SecureWalletInfo extends BaseWalletInfo {
  icon?: string | null | false;
  description: string;
}

export interface InsecureWalletInfo extends BaseWalletInfo {
  example: string;
}

const WEB3_TYPES = {
  MetamaskInpageProvider: {
    lid: 'x_MetaMask',
    icon: MetamaskIcon
  },
  EthereumProvider: {
    lid: 'x_Mist',
    icon: MistIcon
  }
};
const WEB3_TYPE: string | false =
  (window as any).web3 && (window as any).web3.currentProvider.constructor.name;

const SECURE_WALLETS = ['web3', 'ledger-nano-s', 'trezor', 'digital-bitbox'];
const INSECURE_WALLETS = ['private-key', 'keystore-file', 'mnemonic-phrase'];

export class WalletDecrypt extends Component<Props, State> {
  public WALLETS: { [key: string]: SecureWalletInfo | InsecureWalletInfo } = {
    web3: {
      lid: WEB3_TYPE ? WEB3_TYPES[WEB3_TYPE].lid : 'x_Web3',
      icon: WEB3_TYPE && WEB3_TYPES[WEB3_TYPE].icon,
      description: 'ADD_Web3Desc',
      component: Web3Decrypt,
      initialParams: {},
      unlock: this.props.unlockWeb3,
      helpLink: `${knowledgeBaseURL}/migration/moving-from-private-key-to-metamask`
    },
    'ledger-nano-s': {
      lid: 'x_Ledger',
      icon: LedgerIcon,
      description: 'ADD_HardwareDesc',
      component: LedgerNanoSDecrypt,
      initialParams: {},
      unlock: this.props.setWallet,
      helpLink:
        'https://ledger.zendesk.com/hc/en-us/articles/115005200009-How-to-use-MyEtherWallet-with-Ledger'
    },
    trezor: {
      lid: 'x_Trezor',
      icon: TrezorIcon,
      description: 'ADD_HardwareDesc',
      component: TrezorDecrypt,
      initialParams: {},
      unlock: this.props.setWallet,
      helpLink: 'https://doc.satoshilabs.com/trezor-apps/mew.html'
    },
    'digital-bitbox': {
      lid: 'x_DigitalBitbox',
      icon: DigitalBitboxIcon,
      description: 'ADD_HardwareDesc',
      component: DigitalBitboxDecrypt,
      initialParams: {},
      unlock: this.props.setWallet,
      helpLink: 'https://digitalbitbox.com/ethereum'
    },
    'keystore-file': {
      lid: 'x_Keystore2',
      example: 'UTC--2017-12-15T17-35-22.547Z--6be6e49e82425a5aa56396db03512f2cc10e95e8',
      component: KeystoreDecrypt,
      initialParams: {
        file: '',
        password: ''
      },
      unlock: this.props.unlockKeystore,
      helpLink: `${knowledgeBaseURL}/private-keys-passwords/difference-beween-private-key-and-keystore-file.html`
    },
    'mnemonic-phrase': {
      lid: 'x_Mnemonic',
      example: 'brain surround have swap horror cheese file distinct',
      component: MnemonicDecrypt,
      initialParams: {},
      unlock: this.props.unlockMnemonic,
      helpLink: `${knowledgeBaseURL}/private-keys-passwords/difference-beween-private-key-and-keystore-file.html`
    },
    'private-key': {
      lid: 'x_PrivKey2',
      example: 'f1d0e0789c6d40f399ca90cc674b7858de4c719e0d5752a60d5d2f6baa45d4c9',
      component: PrivateKeyDecrypt,
      initialParams: {
        key: '',
        password: ''
      },
      unlock: this.props.unlockPrivateKey,
      helpLink: `${knowledgeBaseURL}/private-keys-passwords/difference-beween-private-key-and-keystore-file.html`
    },
    'view-only': {
      lid: 'View Address',
      example: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
      component: ViewOnlyDecrypt,
      initialParams: {},
      unlock: this.props.setWallet,
      helpLink: ''
    }
  };
  public state: State = {
    selectedWalletKey: null,
    value: null
  };

  public getDecryptionComponent() {
    const { selectedWalletKey, value } = this.state;
    if (!selectedWalletKey) {
      return null;
    }

    const selectedWallet = this.WALLETS[selectedWalletKey];
    if (!selectedWallet) {
      return null;
    }

    return (
      <selectedWallet.component value={value} onChange={this.onChange} onUnlock={this.onUnlock} />
    );
  }

  public isOnlineRequiredWalletAndOffline(selectedWalletKey) {
    const onlineRequiredWallets = ['trezor', 'ledger-nano-s'];
    return this.props.offline && onlineRequiredWallets.includes(selectedWalletKey);
  }

  public buildWalletOptions() {
    const viewOnly = this.WALLETS['view-only'] as InsecureWalletInfo;

    return (
      <div className="WalletDecrypt-wallets">
        <h2 className="WalletDecrypt-wallets-title">
          {translate('What type of wallet are you using?')}
        </h2>

        <div className="WalletDecrypt-wallets-row">
          {SECURE_WALLETS.map(id => {
            const wallet = this.WALLETS[id] as SecureWalletInfo;
            return (
              <div key={id} className="WalletButton WalletButton--secure">
                <div className="WalletButton-title">
                  {wallet.icon && <img className="WalletButton-title-icon" src={wallet.icon} />}
                  {translate(wallet.lid)}
                </div>
                <div className="WalletButton-description">{translate(wallet.description)}</div>
                <div className="WalletButton-icons">
                  <i className="fa fa-shield" />
                  {wallet.helpLink && (
                    <NewTabLink href={wallet.helpLink}>
                      <i className="fa fa-question-circle" />
                    </NewTabLink>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="WalletDecrypt-wallets-row">
          {INSECURE_WALLETS.map(id => {
            const wallet = this.WALLETS[id] as InsecureWalletInfo;
            return (
              <div key={id} className="WalletButton WalletButton--insecure">
                <div className="WalletButton-title">{translate(wallet.lid)}</div>
                <div className="WalletButton-example">{wallet.example}</div>
                <div className="WalletButton-icons">
                  <i className="fa fa-exclamation-triangle" />
                  {wallet.helpLink && (
                    <NewTabLink href={wallet.helpLink}>
                      <i className="fa fa-question-circle" />
                    </NewTabLink>
                  )}
                </div>
              </div>
            );
          })}

          <div className="WalletButton WalletButton--insecure">
            <div className="WalletButton-title">{translate(viewOnly.lid)}</div>
            <div className="WalletButton-example">{viewOnly.example}</div>
            <div className="WalletButton-icons">
              <i className="fa fa-eye" />
            </div>
          </div>
        </div>
      </div>
    );

    /*map(this.WALLETS, (wallet, key) => {
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
    });*/
  }

  public handleDecryptionChoiceChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const wallet = this.WALLETS[(event.target as HTMLInputElement).value];

    if (!wallet) {
      return;
    }

    this.setState({
      selectedWalletKey: (event.target as HTMLInputElement).value,
      value: wallet.initialParams
    });
  };

  public render() {
    const { wallet, hidden } = this.props;
    const decryptionComponent = this.getDecryptionComponent();
    const unlocked = !!wallet;
    return (
      <div>
        <NavigationPrompt when={unlocked} onConfirm={this.props.resetWallet} />
        {!hidden &&
          <article className="Tab-content-pane row">
            <div className="col-sm-12">{decryptionComponent || this.buildWalletOptions()}</div>
          </article>
        }
      </div>
    );
  }

  public onChange = (value: UnlockParams) => {
    this.setState({ value });
  };

  public onUnlock = (payload: any) => {
    const { value, selectedWalletKey } = this.state;
    if (!selectedWalletKey) {
      return;
    }

    // some components (TrezorDecrypt) don't take an onChange prop, and thus
    // this.state.value will remain unpopulated. in this case, we can expect
    // the payload to contain the unlocked wallet info.
    const unlockValue = value && !isEmpty(value) ? value : payload;
    this.WALLETS[selectedWalletKey].unlock(unlockValue);
    this.props.resetTransactionState();
  };
}

function mapStateToProps(state: AppState) {
  return {
    offline: state.config.offline,
    wallet: state.wallet.inst
  };
}

export default connect(mapStateToProps, {
  unlockKeystore,
  unlockMnemonic,
  unlockPrivateKey,
  unlockWeb3,
  setWallet,
  resetWallet,
  resetTransactionState: reset
})(WalletDecrypt);

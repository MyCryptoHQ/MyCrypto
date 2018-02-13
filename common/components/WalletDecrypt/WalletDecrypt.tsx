import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
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
import translate from 'translations';
import {
  KeystoreDecrypt,
  LedgerNanoSDecrypt,
  MnemonicDecrypt,
  PrivateKeyDecrypt,
  PrivateKeyValue,
  TrezorDecrypt,
  ViewOnlyDecrypt,
  Web3Decrypt,
  WalletButton,
  InsecureWalletWarning
} from './components';
import { AppState } from 'reducers';
import { showNotification, TShowNotification } from 'actions/notifications';
import { getDisabledWallets } from 'selectors/wallet';
import { DisabledWallets } from './disables';
import {
  SecureWalletName,
  InsecureWalletName,
  MiscWalletName,
  WalletName,
  knowledgeBaseURL,
  donationAddressMap
} from 'config';
import { isWeb3NodeAvailable } from 'libs/nodes/web3';
import LedgerIcon from 'assets/images/wallets/ledger.svg';
import MetamaskIcon from 'assets/images/wallets/metamask.svg';
import MistIcon from 'assets/images/wallets/mist.svg';
import TrezorIcon from 'assets/images/wallets/trezor.svg';
import './WalletDecrypt.scss';

interface OwnProps {
  hidden?: boolean;
  disabledWallets?: DisabledWallets;
  showGenerateLink?: boolean;
}

interface DispatchProps {
  unlockKeystore: TUnlockKeystore;
  unlockMnemonic: TUnlockMnemonic;
  unlockPrivateKey: TUnlockPrivateKey;
  unlockWeb3: TUnlockWeb3;
  setWallet: TSetWallet;
  resetWallet: TResetWallet;
  resetTransactionState: TReset;
  showNotification: TShowNotification;
}

interface StateProps {
  computedDisabledWallets: DisabledWallets;
  isWalletPending: AppState['wallet']['isWalletPending'];
  isPasswordPending: AppState['wallet']['isPasswordPending'];
}

type Props = OwnProps & StateProps & DispatchProps;

type UnlockParams = {} | PrivateKeyValue;
interface State {
  selectedWalletKey: WalletName | null;
  value: UnlockParams | null;
  hasAcknowledgedInsecure: boolean;
}

interface BaseWalletInfo {
  lid: string;
  component: any;
  initialParams: object;
  unlock: any;
  helpLink: string;
  isReadOnly?: boolean;
  attemptUnlock?: boolean;
}

export interface SecureWalletInfo extends BaseWalletInfo {
  icon?: string;
  description: string;
}

export interface InsecureWalletInfo extends BaseWalletInfo {
  example: string;
}

// tslint:disable-next-line:no-empty-interface
interface MiscWalletInfo extends InsecureWalletInfo {}

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

type SecureWallets = { [key in SecureWalletName]: SecureWalletInfo };
type InsecureWallets = { [key in InsecureWalletName]: InsecureWalletInfo };
type MiscWallet = { [key in MiscWalletName]: MiscWalletInfo };
type Wallets = SecureWallets & InsecureWallets & MiscWallet;

const WEB3_TYPE: string | false =
  (window as any).web3 && (window as any).web3.currentProvider.constructor.name;

const SECURE_WALLETS = Object.values(SecureWalletName);
const INSECURE_WALLETS = Object.values(InsecureWalletName);
const MISC_WALLETS = Object.values(MiscWalletName);

export class WalletDecrypt extends Component<Props, State> {
  // https://github.com/Microsoft/TypeScript/issues/13042
  // index signature should become [key: Wallets] (from config) once typescript bug is fixed
  public WALLETS: Wallets = {
    [SecureWalletName.WEB3]: {
      lid: WEB3_TYPE ? WEB3_TYPES[WEB3_TYPE].lid : 'x_Web3',
      icon: WEB3_TYPE && WEB3_TYPES[WEB3_TYPE].icon,
      description: 'ADD_Web3Desc',
      component: Web3Decrypt,
      initialParams: {},
      unlock: this.props.unlockWeb3,
      attemptUnlock: true,
      helpLink: `${knowledgeBaseURL}/migration/moving-from-private-key-to-metamask`
    },
    [SecureWalletName.LEDGER_NANO_S]: {
      lid: 'x_Ledger',
      icon: LedgerIcon,
      description: 'ADD_HardwareDesc',
      component: LedgerNanoSDecrypt,
      initialParams: {},
      unlock: this.props.setWallet,
      helpLink: 'https://support.ledgerwallet.com/hc/en-us/articles/115005200009'
    },
    [SecureWalletName.TREZOR]: {
      lid: 'x_Trezor',
      icon: TrezorIcon,
      description: 'ADD_HardwareDesc',
      component: TrezorDecrypt,
      initialParams: {},
      unlock: this.props.setWallet,
      helpLink: 'https://doc.satoshilabs.com/trezor-apps/mew.html'
    },
    [InsecureWalletName.KEYSTORE_FILE]: {
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
    [InsecureWalletName.MNEMONIC_PHRASE]: {
      lid: 'x_Mnemonic',
      example: 'brain surround have swap horror cheese file distinct',
      component: MnemonicDecrypt,
      initialParams: {},
      unlock: this.props.unlockMnemonic,
      helpLink: `${knowledgeBaseURL}/private-keys-passwords/difference-beween-private-key-and-keystore-file.html`
    },
    [InsecureWalletName.PRIVATE_KEY]: {
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
    [MiscWalletName.VIEW_ONLY]: {
      lid: 'View Address',
      example: donationAddressMap.ETH,
      component: ViewOnlyDecrypt,
      initialParams: {},
      unlock: this.props.setWallet,
      helpLink: '',
      isReadOnly: true
    }
  };

  public state: State = {
    selectedWalletKey: null,
    value: null,
    hasAcknowledgedInsecure: false
  };

  public componentWillReceiveProps(nextProps: Props) {
    // Reset state when unlock is hidden / revealed
    if (nextProps.hidden !== this.props.hidden) {
      this.setState({
        value: null,
        selectedWalletKey: null
      });
    }
  }

  public getSelectedWallet() {
    const { selectedWalletKey } = this.state;
    if (!selectedWalletKey) {
      return null;
    }

    return this.WALLETS[selectedWalletKey];
  }

  public getDecryptionComponent() {
    const { selectedWalletKey, hasAcknowledgedInsecure } = this.state;
    const selectedWallet = this.getSelectedWallet();
    if (!selectedWalletKey || !selectedWallet) {
      return null;
    }

    if (INSECURE_WALLETS.includes(selectedWalletKey) && !hasAcknowledgedInsecure) {
      return (
        <div className="WalletDecrypt-decrypt">
          <InsecureWalletWarning
            walletType={translate(selectedWallet.lid)}
            onContinue={this.handleAcknowledgeInsecure}
            onCancel={this.clearWalletChoice}
          />
        </div>
      );
    }

    return (
      <div className="WalletDecrypt-decrypt">
        <button className="WalletDecrypt-decrypt-back" onClick={this.clearWalletChoice}>
          <i className="fa fa-arrow-left" /> {translate('Change Wallet')}
        </button>
        <h2 className="WalletDecrypt-decrypt-title">
          {!selectedWallet.isReadOnly && 'Unlock your'} {translate(selectedWallet.lid)}
        </h2>
        <section className="WalletDecrypt-decrypt-form">
          <selectedWallet.component
            value={this.state.value}
            onChange={this.onChange}
            onUnlock={this.onUnlock}
            showNotification={this.props.showNotification}
            isWalletPending={
              this.state.selectedWalletKey === InsecureWalletName.KEYSTORE_FILE
                ? this.props.isWalletPending
                : undefined
            }
            isPasswordPending={
              this.state.selectedWalletKey === InsecureWalletName.KEYSTORE_FILE
                ? this.props.isPasswordPending
                : undefined
            }
          />
        </section>
      </div>
    );
  }

  public handleAcknowledgeInsecure = () => {
    this.setState({ hasAcknowledgedInsecure: true });
  };

  public buildWalletOptions() {
    const { computedDisabledWallets } = this.props;
    const { reasons } = computedDisabledWallets;

    return (
      <div className="WalletDecrypt-wallets">
        <h2 className="WalletDecrypt-wallets-title">{translate('decrypt_Access')}</h2>

        <div className="WalletDecrypt-wallets-row">
          {SECURE_WALLETS.map((walletType: SecureWalletName) => {
            const wallet = this.WALLETS[walletType];
            return (
              <WalletButton
                key={walletType}
                name={translate(wallet.lid)}
                description={translate(wallet.description)}
                icon={wallet.icon}
                helpLink={wallet.helpLink}
                walletType={walletType}
                isSecure={true}
                isDisabled={this.isWalletDisabled(walletType)}
                disableReason={reasons[walletType]}
                onClick={this.handleWalletChoice}
              />
            );
          })}
        </div>
        <div className="WalletDecrypt-wallets-row">
          {INSECURE_WALLETS.map((walletType: InsecureWalletName) => {
            const wallet = this.WALLETS[walletType];
            return (
              <WalletButton
                key={walletType}
                name={translate(wallet.lid)}
                example={wallet.example}
                helpLink={wallet.helpLink}
                walletType={walletType}
                isSecure={false}
                isDisabled={this.isWalletDisabled(walletType)}
                disableReason={reasons[walletType]}
                onClick={this.handleWalletChoice}
              />
            );
          })}

          {MISC_WALLETS.map((walletType: MiscWalletName) => {
            const wallet = this.WALLETS[walletType];
            return (
              <WalletButton
                key={walletType}
                name={translate(wallet.lid)}
                example={wallet.example}
                helpLink={wallet.helpLink}
                walletType={walletType}
                isReadOnly={true}
                isDisabled={this.isWalletDisabled(walletType)}
                disableReason={reasons[walletType]}
                onClick={this.handleWalletChoice}
              />
            );
          })}
        </div>

        {this.props.showGenerateLink && (
          <div className="WalletDecrypt-wallets-generate">
            Don’t have a wallet? <Link to="/generate">Click here to get one</Link>.
          </div>
        )}
      </div>
    );
  }

  public handleWalletChoice = async (walletType: WalletName) => {
    const wallet = this.WALLETS[walletType];

    if (!wallet) {
      return;
    }

    let timeout = 0;
    const web3Available = await isWeb3NodeAvailable();
    if (wallet.attemptUnlock && web3Available) {
      // timeout is only the maximum wait time before secondary view is shown
      // send view will be shown immediately on web3 resolve
      timeout = 1000;
      wallet.unlock();
    }

    window.setTimeout(() => {
      this.setState({
        selectedWalletKey: walletType,
        value: wallet.initialParams,
        hasAcknowledgedInsecure: false
      });
    }, timeout);
  };

  public clearWalletChoice = () => {
    this.setState({
      selectedWalletKey: null,
      value: null,
      hasAcknowledgedInsecure: false
    });
  };

  public render() {
    const { hidden } = this.props;
    const selectedWallet = this.getSelectedWallet();
    const decryptionComponent = this.getDecryptionComponent();
    return (
      <div>
        {!hidden && (
          <article className="Tab-content-pane">
            <div className="WalletDecrypt">
              <TransitionGroup>
                {decryptionComponent && selectedWallet ? (
                  <CSSTransition classNames="DecryptContent" timeout={500} key="decrypt">
                    {decryptionComponent}
                  </CSSTransition>
                ) : (
                  <CSSTransition classNames="DecryptContent" timeout={500} key="wallets">
                    {this.buildWalletOptions()}
                  </CSSTransition>
                )}
              </TransitionGroup>
            </div>
          </article>
        )}
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

  private isWalletDisabled = (walletKey: WalletName) => {
    return this.props.computedDisabledWallets.wallets.indexOf(walletKey) !== -1;
  };
}

function mapStateToProps(state: AppState, ownProps: Props) {
  const { disabledWallets } = ownProps;
  let computedDisabledWallets = getDisabledWallets(state);

  if (disabledWallets) {
    computedDisabledWallets = {
      wallets: [...computedDisabledWallets.wallets, ...disabledWallets.wallets],
      reasons: {
        ...computedDisabledWallets.reasons,
        ...disabledWallets.reasons
      }
    };
  }

  return {
    computedDisabledWallets,
    isWalletPending: state.wallet.isWalletPending,
    isPasswordPending: state.wallet.isPasswordPending
  };
}

export default connect<StateProps, DispatchProps>(mapStateToProps, {
  unlockKeystore,
  unlockMnemonic,
  unlockPrivateKey,
  unlockWeb3,
  setWallet,
  resetWallet,
  resetTransactionState: reset,
  showNotification
})(WalletDecrypt);

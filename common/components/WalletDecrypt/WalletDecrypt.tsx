import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

import {
  HardwareWalletName,
  SecureWalletName,
  InsecureWalletName,
  MiscWalletName,
  WalletName,
  knowledgeBaseURL,
  donationAddressMap
} from 'config';
import translate, { translateRaw } from 'translations';
import { isWeb3NodeAvailable } from 'libs/nodes/web3';
import { wikiLink as paritySignerHelpLink } from 'libs/wallet/non-deterministic/parity';
import { AppState } from 'features/reducers';
import * as derivedSelectors from 'features/selectors';
import { walletActions } from 'features/wallet';
import { transactionFieldsActions } from 'features/transaction';
import { notificationsActions } from 'features/notifications';
import LedgerIcon from 'assets/images/wallets/ledger.svg';
import TrezorIcon from 'assets/images/wallets/trezor.svg';
import SafeTIcon from 'assets/images/wallets/safe-t.svg';
import ParitySignerIcon from 'assets/images/wallets/parity-signer.svg';
import { Errorable } from 'components';
import { DisabledWallets } from './disables';
import { getWeb3ProviderInfo } from 'utils/web3';
import {
  KeystoreDecrypt,
  LedgerNanoSDecrypt,
  MnemonicDecrypt,
  PrivateKeyDecrypt,
  PrivateKeyValue,
  TrezorDecrypt,
  SafeTminiDecrypt,
  ViewOnlyDecrypt,
  Web3Decrypt,
  WalletButton,
  ParitySignerDecrypt,
  InsecureWalletWarning
} from './components';
import './WalletDecrypt.scss';

interface OwnProps {
  hidden?: boolean;
  disabledWallets?: DisabledWallets;
  showGenerateLink?: boolean;
}

interface DispatchProps {
  unlockKeystore: walletActions.TUnlockKeystore;
  unlockMnemonic: walletActions.TUnlockMnemonic;
  unlockPrivateKey: walletActions.TUnlockPrivateKey;
  unlockWeb3: walletActions.TUnlockWeb3;
  setWallet: walletActions.TSetWallet;
  resetTransactionRequested: transactionFieldsActions.TResetTransactionRequested;
  showNotification: notificationsActions.TShowNotification;
}

interface StateProps {
  computedDisabledWallets: DisabledWallets;
  isWalletPending: AppState['wallet']['isWalletPending'];
  isPasswordPending: AppState['wallet']['isPasswordPending'];
}

type Props = OwnProps & StateProps & DispatchProps & RouteComponentProps<{}>;

type UnlockParams = {} | PrivateKeyValue;
interface State {
  selectedWalletKey: WalletName | null;
  isInsecureOverridden: boolean;
  value: UnlockParams | null;
}

interface BaseWalletInfo {
  lid: string;
  component: any;
  initialParams: object;
  unlock: any;
  helpLink: string;
  isReadOnly?: boolean;
  attemptUnlock?: boolean;
  redirect?: string;
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

type HardwareWallets = { [key in HardwareWalletName]: SecureWalletInfo };
type SecureWallets = { [key in SecureWalletName]: SecureWalletInfo };
type InsecureWallets = { [key in InsecureWalletName]: InsecureWalletInfo };
type MiscWallet = { [key in MiscWalletName]: MiscWalletInfo };
type Wallets = HardwareWallets & SecureWallets & InsecureWallets & MiscWallet;

const HARDWARE_WALLETS = Object.values(HardwareWalletName);
/** @desc Hardware wallets are secure too, but we want to avoid duplication. */
const SECURE_WALLETS = Object.values(SecureWalletName).filter(
  value => !HARDWARE_WALLETS.includes(value)
);
const INSECURE_WALLETS = Object.values(InsecureWalletName);
const MISC_WALLETS = Object.values(MiscWalletName);

const web3info = getWeb3ProviderInfo();

const WalletDecrypt = withRouter<Props>(
  class WalletDecryptClass extends Component<RouteComponentProps<{}> & Props, State> {
    // https://github.com/Microsoft/TypeScript/issues/13042
    // index signature should become [key: Wallets] (from config) once typescript bug is fixed
    public WALLETS: Wallets = {
      [SecureWalletName.WEB3]: {
        lid: web3info.lid,
        icon: web3info.icon,
        description: 'ADD_WEB3DESC',
        component: Web3Decrypt,
        initialParams: {},
        unlock: this.props.unlockWeb3,
        attemptUnlock: true,
        helpLink: `${knowledgeBaseURL}/migration/moving-from-private-key-to-metamask`
      },
      [SecureWalletName.LEDGER_NANO_S]: {
        lid: 'X_LEDGER',
        icon: LedgerIcon,
        description: 'ADD_HARDWAREDESC',
        component: LedgerNanoSDecrypt,
        initialParams: {},
        unlock: this.props.setWallet,
        helpLink: 'https://support.ledgerwallet.com/hc/en-us/articles/115005200009'
      },
      [SecureWalletName.TREZOR]: {
        lid: 'X_TREZOR',
        icon: TrezorIcon,
        description: 'ADD_HARDWAREDESC',
        component: TrezorDecrypt,
        initialParams: {},
        unlock: this.props.setWallet,
        helpLink:
          'https://support.mycrypto.com/accessing-your-wallet/how-to-use-your-trezor-with-mycrypto.html'
      },
      [SecureWalletName.SAFE_T]: {
        lid: 'X_SAFE_T',
        icon: SafeTIcon,
        description: 'ADD_HARDWAREDESC',
        component: SafeTminiDecrypt,
        initialParams: {},
        unlock: this.props.setWallet,
        // TODO - Update with the right id once available
        helpLink: 'https://www.archos.com/fr/products/crypto/faq.html'
      },
      [SecureWalletName.PARITY_SIGNER]: {
        lid: 'X_PARITYSIGNER',
        icon: ParitySignerIcon,
        description: 'ADD_PARITY_DESC',
        component: ParitySignerDecrypt,
        initialParams: {},
        unlock: this.props.setWallet,
        helpLink: paritySignerHelpLink
      },
      [InsecureWalletName.KEYSTORE_FILE]: {
        lid: 'X_KEYSTORE2',
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
        lid: 'X_MNEMONIC',
        example: 'brain surround have swap horror cheese file distinct',
        component: MnemonicDecrypt,
        initialParams: {},
        unlock: this.props.unlockMnemonic,
        helpLink: `${knowledgeBaseURL}/private-keys-passwords/difference-beween-private-key-and-keystore-file.html`
      },
      [InsecureWalletName.PRIVATE_KEY]: {
        lid: 'X_PRIVKEY2',
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
        lid: 'VIEW_ADDR',
        example: donationAddressMap.ETH,
        component: ViewOnlyDecrypt,
        initialParams: {},
        unlock: this.props.setWallet,
        helpLink: '',
        isReadOnly: true,
        redirect: '/account/info'
      }
    };

    public state: State = {
      selectedWalletKey: null,
      isInsecureOverridden: false,
      value: null
    };

    public UNSAFE_componentWillReceiveProps(nextProps: Props) {
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
      const { selectedWalletKey, isInsecureOverridden } = this.state;
      const selectedWallet = this.getSelectedWallet();
      if (!selectedWalletKey || !selectedWallet) {
        return null;
      }

      const isInsecure = INSECURE_WALLETS.includes(selectedWalletKey);
      if (isInsecure && !isInsecureOverridden && !process.env.BUILD_DOWNLOADABLE) {
        return (
          <div className="WalletDecrypt-decrypt">
            <InsecureWalletWarning
              walletType={translateRaw(selectedWallet.lid)}
              onCancel={this.clearWalletChoice}
            />
            {process.env.NODE_ENV !== 'production' && (
              <button
                className="WalletDecrypt-decrypt-override"
                onClick={this.overrideInsecureWarning}
              >
                I'm a dev, override this
              </button>
            )}
          </div>
        );
      }

      return (
        <div className="WalletDecrypt-decrypt">
          <button className="WalletDecrypt-decrypt-back" onClick={this.clearWalletChoice}>
            <i className="fa fa-arrow-left" /> {translate('CHANGE_WALLET')}
          </button>
          <h2 className="WalletDecrypt-decrypt-title">
            {!selectedWallet.isReadOnly && translate('UNLOCK_WALLET')}{' '}
            {translate(selectedWallet.lid)}
          </h2>
          <section className="WalletDecrypt-decrypt-form">
            <Errorable
              errorMessage={`Oops, looks like ${translateRaw(
                selectedWallet.lid
              )} is not supported by your browser`}
              onError={this.clearWalletChoice}
              shouldCatch={selectedWallet.lid === this.WALLETS.paritySigner.lid}
            >
              <selectedWallet.component
                value={this.state.value}
                onChange={this.onChange}
                onUnlock={(value: any) => {
                  if (selectedWallet.redirect) {
                    this.props.history.push(selectedWallet.redirect);
                  }
                  this.onUnlock(value);
                }}
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
            </Errorable>
          </section>
        </div>
      );
    }

    public buildWalletOptions() {
      const { computedDisabledWallets } = this.props;
      const { reasons } = computedDisabledWallets;

      return (
        <div className="WalletDecrypt-wallets">
          <h2 className="WalletDecrypt-wallets-title">{translate('DECRYPT_ACCESS')}</h2>

          <div className="WalletDecrypt-wallets-row">
            {HARDWARE_WALLETS.map((walletType: SecureWalletName) => {
              const wallet = this.WALLETS[walletType];
              return (
                <WalletButton
                  key={walletType}
                  name={translateRaw(wallet.lid)}
                  description={translateRaw(wallet.description)}
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
            {SECURE_WALLETS.map((walletType: SecureWalletName) => {
              const wallet = this.WALLETS[walletType];
              return (
                <WalletButton
                  key={walletType}
                  name={translateRaw(wallet.lid)}
                  description={translateRaw(wallet.description)}
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
            {MISC_WALLETS.map((walletType: MiscWalletName) => {
              const wallet = this.WALLETS[walletType];
              return (
                <WalletButton
                  key={walletType}
                  name={translateRaw(wallet.lid)}
                  example={wallet.example}
                  helpLink={wallet.helpLink}
                  walletType={walletType}
                  isReadOnly={true}
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
                  name={translateRaw(wallet.lid)}
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
          </div>

          {this.props.showGenerateLink && (
            <div className="WalletDecrypt-wallets-generate">
              <Link to="/generate">{translate('DONT_HAVE_WALLET_PROMPT')}</Link>
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
      if (wallet.attemptUnlock) {
        const web3Available = await isWeb3NodeAvailable();
        if (web3Available) {
          // timeout is only the maximum wait time before secondary view is shown
          // send view will be shown immediately on web3 resolve
          timeout = 1500;
          wallet.unlock();
        }
      }

      window.setTimeout(() => {
        this.setState({
          selectedWalletKey: walletType,
          value: wallet.initialParams
        });
      }, timeout);
    };

    public clearWalletChoice = () => {
      this.setState({
        selectedWalletKey: null,
        value: null
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
      this.props.resetTransactionRequested();
    };

    private isWalletDisabled = (walletKey: WalletName) => {
      return this.props.computedDisabledWallets.wallets.indexOf(walletKey) !== -1;
    };

    private overrideInsecureWarning = () => {
      if (process.env.NODE_ENV !== 'production') {
        this.setState({ isInsecureOverridden: true });
      }
    };
  }
);

function mapStateToProps(state: AppState, ownProps: Props) {
  const { disabledWallets } = ownProps;
  let computedDisabledWallets = derivedSelectors.getDisabledWallets(state);

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

export default connect(mapStateToProps, {
  unlockKeystore: walletActions.unlockKeystore,
  unlockMnemonic: walletActions.unlockMnemonic,
  unlockPrivateKey: walletActions.unlockPrivateKey,
  unlockWeb3: walletActions.unlockWeb3,
  setWallet: walletActions.setWallet,
  resetTransactionRequested: transactionFieldsActions.resetTransactionRequested,
  showNotification: notificationsActions.showNotification
})(WalletDecrypt) as React.ComponentClass<OwnProps>;

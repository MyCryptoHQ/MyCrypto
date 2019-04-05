import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
//import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

import {
  HardwareWalletName,
  SecureWalletName,
  InsecureWalletName,
  //MiscWalletName,
  WalletName,
  knowledgeBaseURL,
  MiscWalletName
} from 'config';
import translate, { translateRaw } from 'translations';
import { isWeb3NodeAvailable } from 'libs/nodes/web3';
import { wikiLink as paritySignerHelpLink } from 'libs/wallet/non-deterministic/parity';
import { AppState } from 'features/reducers';
import * as derivedSelectors from 'features/selectors';
import { walletActions, walletSelectors } from 'features/wallet';
import { transactionFieldsActions } from 'features/transaction';
import { notificationsActions } from 'features/notifications';
import LedgerIcon from 'assets/images/wallets/ledger.svg';
import TrezorIcon from 'assets/images/wallets/trezor.svg';
import SafeTIcon from 'assets/images/wallets/safe-t.svg';
import ParitySignerIcon from 'assets/images/wallets/parity-signer.svg';
import { Errorable } from 'components';
import { Warning } from 'components/ui';
//import { NetworkOptions } from 'v2/services';
import { DisabledWallets } from './components/disables';
import { getWeb3ProviderInfo } from 'utils/web3';
import {
  KeystoreDecrypt,
  LedgerNanoSDecrypt,
  MnemonicDecrypt,
  PrivateKeyDecrypt,
  PrivateKeyValue,
  TrezorDecrypt,
  SafeTminiDecrypt,
  Web3Decrypt,
  WalletButton,
  ParitySignerDecrypt,
  InsecureWalletWarning,
  ViewOnlyDecrypt
  ////SelectNetworkPanel
} from './components';
import './AddAccountStyles.scss';
import { /*Panel,*/ Button, Typography, ComboBox } from '@mycrypto/ui';
import { Layout } from 'v2/features';
//import { ContentPanel } from 'v2/components';
import backArrow from 'common/assets/images/icn-back-arrow.svg';

//import styled from 'styled-components';
import { NetworkOptionsContext } from 'v2/providers';
//import { fieldsReducer } from 'features/transaction/fields/reducer';

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
  accessMessage: ReturnType<typeof walletSelectors.getWalletAccessMessage>;
}

type Props = OwnProps & StateProps & DispatchProps & RouteComponentProps<{}>;

type UnlockParams = {} | PrivateKeyValue;
interface State {
  selectedWalletKey: WalletName | null;
  isInsecureOverridden: boolean;
  value: UnlockParams | null;
  hasSelectedNetwork: boolean;
}

interface BaseWalletInfo {
  lid: string;
  component: any;
  initialParams: object;
  unlock: any;
  attemptUnlock?: boolean;
  redirect?: string;
  helpLink: string;
  isReadOnly?: boolean;
}

export interface SecureWalletInfo extends BaseWalletInfo {
  icon?: string;
  description: string;
}

export interface InsecureWalletInfo extends BaseWalletInfo {
  example: string;
}

export interface MiscWalletInfo extends BaseWalletInfo {
  description: string;
}

type HardwareWallets = { [key in HardwareWalletName]: SecureWalletInfo };
type SecureWallets = { [key in SecureWalletName]: SecureWalletInfo };
type InsecureWallets = { [key in InsecureWalletName]: InsecureWalletInfo };
type MiscWallets = { [key in MiscWalletName]: MiscWalletInfo };
type Wallets = HardwareWallets & SecureWallets & InsecureWallets & MiscWallets;

const HARDWARE_WALLETS = Object.values(HardwareWalletName);
/** @desc Hardware wallets are secure too, but we want to avoid duplication. */
const SECURE_WALLETS = Object.values(SecureWalletName).filter(
  value => !HARDWARE_WALLETS.includes(value)
);
const INSECURE_WALLETS = Object.values(InsecureWalletName);

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
        helpLink: `${knowledgeBaseURL}/how-to/migrating/moving-from-mycrypto-to-metamask`
      },
      [SecureWalletName.LEDGER_NANO_S]: {
        lid: 'X_LEDGER',
        icon: LedgerIcon,
        description: 'ADD_HARDWAREDESC',
        component: LedgerNanoSDecrypt,
        initialParams: {},
        unlock: this.props.setWallet,
        helpLink: 'https://support.ledger.com/hc/en-us/articles/360008268594'
      },
      [SecureWalletName.TREZOR]: {
        lid: 'X_TREZOR',
        icon: TrezorIcon,
        description: 'ADD_HARDWAREDESC',
        component: TrezorDecrypt,
        initialParams: {},
        unlock: this.props.setWallet,
        helpLink: `${knowledgeBaseURL}/how-to/migrating/moving-from-mycrypto-to-trezor`
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
        helpLink: `${knowledgeBaseURL}/general-knowledge/ethereum-blockchain/difference-between-wallet-types`
      },
      [InsecureWalletName.MNEMONIC_PHRASE]: {
        lid: 'X_MNEMONIC',
        example: 'brain surround have swap horror cheese file distinct',
        component: MnemonicDecrypt,
        initialParams: {},
        unlock: this.props.unlockMnemonic,
        helpLink: `${knowledgeBaseURL}/general-knowledge/ethereum-blockchain/difference-between-wallet-types`
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
        helpLink: `${knowledgeBaseURL}/general-knowledge/ethereum-blockchain/difference-between-wallet-types`
      },
      [MiscWalletName.VIEW_ONLY]: {
        lid: 'VIEW_ADDR',
        description: 'ADD_VIEW_ADDRESS_DESC',
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
      value: null,
      hasSelectedNetwork: false
    };

    public exists: boolean = true;

    public UNSAFE_componentWillReceiveProps(nextProps: Props) {
      // Reset state when unlock is hidden / revealed
      if (nextProps.hidden !== this.props.hidden) {
        this.setState({
          value: null,
          selectedWalletKey: null
        });
      }
    }

    public componentWillUnmount() {
      this.exists = false;
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
        <div className="Panel">
          <div className="Panel-top">
            <Button basic={true} onClick={this.clearWalletChoice}>
              <Typography>
                {' '}
                <img src={backArrow} />
                {translate('CHANGE_WALLET')}
              </Typography>
            </Button>
          </div>
          <div className="Panel-content">
            <div className="Panel-title-connectDevice">
              {!(selectedWallet.isReadOnly || selectedWallet.lid === 'X_PARITYSIGNER') &&
                translate('UNLOCK_WALLET', {
                  $wallet: translateRaw(selectedWallet.lid)
                })}
            </div>
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
        </div>
      );
    }

    public buildWalletOptions() {
      const { computedDisabledWallets, accessMessage } = this.props;
      const { reasons } = computedDisabledWallets;

      return (
        <div className="WalletDecrypt-wallets">
          <h2 className="WalletDecrypt-wallets-title">{translate('DECRYPT_ACCESS')}</h2>
          {accessMessage && (
            <div className="WalletDecrypt-wallets-row">
              <Warning>{accessMessage}</Warning>
            </div>
          )}
          <div className="WalletDecrypt-wallets-row">
            {HARDWARE_WALLETS.map((walletType: SecureWalletName) => {
              const wallet = this.WALLETS[walletType];
              return (
                <WalletButton
                  key={walletType}
                  name={translateRaw(wallet.lid)}
                  //description={translateRaw(wallet.description)}
                  icon={wallet.icon}
                  //helpLink={wallet.helpLink}
                  walletType={walletType}
                  //isSecure={true}
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
                  //description={translateRaw(wallet.description)}
                  icon={wallet.icon}
                  //helpLink={wallet.helpLink}
                  walletType={walletType}
                  //isSecure={true}
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
                  //helpLink={wallet.helpLink}
                  walletType={walletType}
                  //isSecure={false}
                  isDisabled={this.isWalletDisabled(walletType)}
                  disableReason={reasons[walletType]}
                  onClick={this.handleWalletChoice}
                />
              );
            })}
          </div>
          <div className="WalletDecrypt-info">
            <Typography>Don't have an account? Create new account now.</Typography>
          </div>
        </div>
      );
    }

    public selectNetworkComponent() {
      return (
        <div className="Panel">
          <div className="SelectNetworkPanel-top">
            <Button basic={true} onClick={this.clearWalletChoice}>
              <Typography>
                {' '}
                <img src={backArrow} />
                {translate('CHANGE_WALLET')}
              </Typography>
            </Button>
          </div>
          <div className="Panel-content">
            <div className="Panel-title">Select Network</div>

            <div className="Panel-description">
              Select the blockchain that you want to operate with. Not sure what to choose? Stick
              with the default choices below and click next.
            </div>

            <label className="Panel-networkLabel">Network</label>
            <NetworkOptionsContext.Consumer>
              {({ networkOptions = [] }) => {
                const networkNames: any[] = [];
                networkOptions.map(en => {
                  networkNames.push(en.name);
                });
                return (
                  <ComboBox
                    className="Panel-dropdown"
                    items={new Set(networkNames.sort())}
                    onChange={this.onChange}
                    placeholder="Ethereum"
                  />
                );
              }}
            </NetworkOptionsContext.Consumer>
            <Button className="Panel-description-button" onClick={this.handleNetworkSelect}>
              Next
            </Button>
          </div>
        </div>
      );
    }

    public handleNetworkSelect = (e: any) => {
      console.log('[handleNetworkSelect] ' + e.value);
      this.setState({ hasSelectedNetwork: true });
    };

    public handleWalletChoice = async (walletType: WalletName) => {
      const { showNotification } = this.props;
      const wallet = this.WALLETS[walletType];

      if (!wallet) {
        return;
      }

      let timeout = 0;
      if (wallet.attemptUnlock) {
        try {
          const web3Available = await isWeb3NodeAvailable();
          if (web3Available) {
            // timeout is only the maximum wait time before secondary view is shown
            // send view will be shown immediately on web3 resolve
            timeout = 1500;
            wallet.unlock();
          }
        } catch (e) {
          // The permissions request for MetaMask was displayed, but permission was denied.
          showNotification('danger', translateRaw('METAMASK_PERMISSION_DENIED'));
        }
      }

      window.setTimeout(() => {
        if (this.exists) {
          this.setState({
            selectedWalletKey: walletType,
            value: wallet.initialParams
          });
        }
      }, timeout);
    };

    public clearWalletChoice = () => {
      this.setState({
        selectedWalletKey: null,
        value: null,
        hasSelectedNetwork: false
      });
    };

    public render() {
      const { hidden } = this.props;
      const selectedWallet = this.getSelectedWallet();
      const decryptionComponent = this.getDecryptionComponent();
      const selectNetworkComponent = this.selectNetworkComponent();
      console.log('[render]', this.state.hasSelectedNetwork);

      let componentToRender: JSX.Element;

      if (!hidden && decryptionComponent && selectedWallet && !this.state.hasSelectedNetwork) {
        componentToRender = (
          <>
            <Layout centered={true}>
              <TransitionGroup>
                <CSSTransition classNames="DecryptContent" timeout={500} key="decrypt">
                  {selectNetworkComponent}
                </CSSTransition>
              </TransitionGroup>
            </Layout>
          </>
        );
      } else if (!hidden && decryptionComponent && selectedWallet) {
        componentToRender = (
          <Layout centered={true}>
            <div className="ConnectDevicePanel">
              <TransitionGroup>
                <CSSTransition classNames="DecryptContent" timeout={500} key="decrypt">
                  {decryptionComponent}
                </CSSTransition>
              </TransitionGroup>
            </div>
          </Layout>
        );
      } else {
        componentToRender = (
          <Layout centered={true}>
            <div className="WalletDecrypt">
              <TransitionGroup>
                <CSSTransition classNames="DecryptContent" timeout={500} key="wallets">
                  {this.buildWalletOptions()}
                </CSSTransition>
              </TransitionGroup>
            </div>
          </Layout>
        );
      }
      return componentToRender;
    }

    public onChange = (value: UnlockParams) => {
      console.log('got here: ' + value);
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
    isPasswordPending: state.wallet.isPasswordPending,
    accessMessage: walletSelectors.getWalletAccessMessage(state)
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

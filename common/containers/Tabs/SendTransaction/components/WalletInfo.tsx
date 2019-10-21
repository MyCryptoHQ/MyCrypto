import React from 'react';
import { connect } from 'react-redux';

import translate, { translateRaw } from 'translations';
import { IWallet } from 'libs/wallet';
import { AppState } from 'features/reducers';
import { configSelectors } from 'features/config';
import { QRCode, Modal } from 'components/ui';
import {
  GenerateKeystoreModal,
  TogglablePassword,
  AddressField,
  PrintableWallet
} from 'components';
import './WalletInfo.scss';

interface OwnProps {
  wallet: IWallet;
}

interface StateProps {
  toChecksumAddress: ReturnType<typeof configSelectors.getChecksumAddressFn>;
}

type Props = OwnProps & StateProps;

interface State {
  address: string;
  privateKey: string;
  isPrivateKeyVisible: boolean;
  isKeystoreModalOpen: boolean;
  isPaperWalletModalOpen: boolean;
}

class WalletInfo extends React.PureComponent<Props, State> {
  public state = {
    address: '',
    privateKey: '',
    isPrivateKeyVisible: false,
    isKeystoreModalOpen: false,
    isPaperWalletModalOpen: false
  };

  public componentDidMount() {
    this.setStateFromWallet(this.props);
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.wallet !== nextProps.wallet) {
      this.setStateFromWallet(nextProps);
    }
  }

  public render() {
    const {
      address,
      privateKey,
      isPrivateKeyVisible,
      isKeystoreModalOpen,
      isPaperWalletModalOpen
    } = this.state;

    return (
      <div className="WalletInfo">
        <div className="Tab-content-pane">
          <AddressField isSelfAddress={true} />

          {privateKey && (
            <div className="row form-group">
              <div className="col-xs-12">
                <label>{translate('X_PRIVKEY')}</label>
                <TogglablePassword
                  disabled={true}
                  value={privateKey}
                  isVisible={isPrivateKeyVisible}
                  toggleAriaLabel={translateRaw('GEN_ARIA_2')}
                  handleToggleVisibility={this.togglePrivateKey}
                />
              </div>
            </div>
          )}
        </div>

        <div className="Tab-content-pane">
          <div className="row">
            <div className="col-xs-6">
              <label>{translate('TOKEN_ADDR')}</label>
              <div className="WalletInfo-qr well well-lg">
                <QRCode data={address} />
              </div>
              <button className="btn btn-primary" onClick={(window as any).print}>
                <i className="fa fa-print" /> {translate('PRINT')}
              </button>
            </div>
            {privateKey && (
              <div>
                <div className="col-xs-6">
                  <label>{translate('X_PRIVKEY2')}</label>
                  <div className="WalletInfo-qr well well-lg" onClick={this.togglePrivateKey}>
                    <QRCode data={isPrivateKeyVisible ? privateKey : '0'} />
                    {!isPrivateKeyVisible && (
                      <div className="WalletInfo-qr-cover">
                        <i className="WalletInfo-qr-cover-icon fa fa-eye" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-xs-6">
                  <label>{translate('WALLET_INFO_UTILITIES')}</label>

                  <button className="btn btn-info btn-block" onClick={this.openPaperWalletModal}>
                    {translate('X_SAVE_PAPER')}
                  </button>

                  <button className="btn btn-info btn-block" onClick={this.openKeystoreModal}>
                    {translate('GENERATE_KEYSTORE_TITLE')}
                  </button>
                </div>
              </div>
            )}

            <GenerateKeystoreModal
              isOpen={isKeystoreModalOpen}
              privateKey={privateKey}
              handleClose={this.closeKeystoreModal}
            />

            <Modal isOpen={isPaperWalletModalOpen} handleClose={this.closePaperWalletModal}>
              <PrintableWallet address={address} privateKey={privateKey} />
            </Modal>
          </div>
        </div>
      </div>
    );
  }

  private setStateFromWallet(props: Props) {
    const { wallet, toChecksumAddress } = props;
    const address = toChecksumAddress(wallet.getAddressString());
    const privateKey = wallet.getPrivateKeyString ? wallet.getPrivateKeyString() : '';
    this.setState({ address, privateKey });
  }

  private togglePrivateKey = () => {
    this.setState({ isPrivateKeyVisible: !this.state.isPrivateKeyVisible });
  };

  private openKeystoreModal = () => this.setState({ isKeystoreModalOpen: true });
  private closeKeystoreModal = () => this.setState({ isKeystoreModalOpen: false });

  private openPaperWalletModal = () => this.setState({ isPaperWalletModalOpen: true });
  private closePaperWalletModal = () => this.setState({ isPaperWalletModalOpen: false });
}

export default connect(
  (state: AppState): StateProps => ({
    toChecksumAddress: configSelectors.getChecksumAddressFn(state)
  })
)(WalletInfo);

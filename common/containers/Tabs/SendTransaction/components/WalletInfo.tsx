import React from 'react';
import { toChecksumAddress } from 'ethereumjs-util';
import translate, { translateRaw } from 'translations';
import { IWallet } from 'libs/wallet';
import { print } from 'components/PrintableWallet';
import { QRCode } from 'components/ui';
import { GenerateKeystoreModal, TogglablePassword, AddressField } from 'components';
import './WalletInfo.scss';

interface Props {
  wallet: IWallet;
}

interface State {
  address: string;
  privateKey: string;
  isPrivateKeyVisible: boolean;
  isKeystoreModalOpen: boolean;
}

export default class WalletInfo extends React.PureComponent<Props, State> {
  public state = {
    address: '',
    privateKey: '',
    isPrivateKeyVisible: false,
    isKeystoreModalOpen: false
  };

  public componentDidMount() {
    this.setStateFromWallet(this.props.wallet);
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.wallet !== nextProps.wallet) {
      this.setStateFromWallet(nextProps.wallet);
    }
  }

  public render() {
    const { address, privateKey, isPrivateKeyVisible, isKeystoreModalOpen } = this.state;

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

                  <button className="btn btn-info btn-block" onClick={print(address, privateKey)}>
                    {translate('X_PRINT')}
                  </button>

                  <button className="btn btn-info btn-block" onClick={this.toggleKeystoreModal}>
                    {translate('GENERATE_KEYSTORE_TITLE')}
                  </button>
                </div>
              </div>
            )}

            <GenerateKeystoreModal
              isOpen={isKeystoreModalOpen}
              privateKey={privateKey}
              handleClose={this.toggleKeystoreModal}
            />
          </div>
        </div>
      </div>
    );
  }

  private setStateFromWallet(wallet: IWallet) {
    const address = toChecksumAddress(wallet.getAddressString());
    const privateKey = wallet.getPrivateKeyString ? wallet.getPrivateKeyString() : '';
    this.setState({ address, privateKey });
  }

  private togglePrivateKey = () => {
    this.setState({ isPrivateKeyVisible: !this.state.isPrivateKeyVisible });
  };

  private toggleKeystoreModal = () => {
    this.setState({ isKeystoreModalOpen: !this.state.isKeystoreModalOpen });
  };
}

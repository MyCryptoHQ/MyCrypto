import React from 'react';
import translate, { translateRaw } from 'translations';
import { IWallet } from 'libs/wallet';
import { print } from 'components/PrintableWallet';
import { Identicon, QRCode } from 'components/ui';
import FaEye from 'c';
import './WalletInfo.scss';

interface Props {
  wallet: IWallet;
}

interface State {
  address: string;
  privateKey: string;
  showPrivateKey: boolean;
}

export default class WalletInfo extends React.Component<Props, State> {
  public state = {
    address: '',
    privateKey: '',
    showPrivateKey: false
  };

  public async componentDidMount() {
    const { wallet } = this.props;
    const address = await wallet.getAddressString();
    let privateKey = '';

    if (wallet.getPrivateKeyString) {
      privateKey = await wallet.getPrivateKeyString();
    }

    this.setState({ address, privateKey });
  }

  public render() {
    const { address, privateKey, showPrivateKey } = this.state;

    return (
      <div className="WalletInfo">
        <div className="Tab-content-pane">
          <div className="row form-group">
            <div className="col-xs-11">
              <label>{translate('x_Address')}</label>
              <input className="form-control" disabled={true} value={address} />
            </div>
            <div className="col-xs-1" style={{ padding: 0 }}>
              <Identicon address={address} />
            </div>
          </div>

          {privateKey && (
            <div className="row form-group">
              <div className="col-xs-12">
                <label>{translate('x_PrivKey')}</label>
                <div className="input-group">
                  <input
                    className="form-control"
                    disabled={true}
                    type={showPrivateKey ? 'text' : 'password'}
                    value={privateKey}
                  />
                  <span
                    onClick={this.togglePrivateKey}
                    aria-label={translateRaw('GEN_Aria_2')}
                    role="button"
                    className="input-group-addon eye"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="Tab-content-pane">
          <div className="row">
            <div className="col-xs-6">
              <label>Public Address</label>
              <div className="WalletInfo-qr well well-lg">
                <QRCode data={address} />
              </div>
            </div>
            {privateKey && (
              <div className="col-xs-6">
                <label>Private Key</label>
                <div className="WalletInfo-qr well well-lg" onClick={this.togglePrivateKey}>
                  <QRCode data={showPrivateKey ? privateKey : '0'} />
                  {!showPrivateKey && (
                    <div className="WalletInfo-qr-cover">
                      <i className="WalletInfo-qr-cover-icon fa fa-eye" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {privateKey && (
              <div className="col-xs-6">
                <label>Utilities</label>
                <button className="btn btn-info btn-block" onClick={print(address, privateKey)}>
                  {translate('x_Print')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  private togglePrivateKey = () => {
    this.setState({ showPrivateKey: !this.state.showPrivateKey });
  };
}

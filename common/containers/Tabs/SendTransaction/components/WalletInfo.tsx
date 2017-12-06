import React from 'react';
import translate from 'translations';
import { IWallet } from 'libs/wallet';
import { Identicon, QRCode } from 'components/ui';
import { print } from 'components/PrintableWallet';

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
      <div>
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
                <input
                  className="form-control"
                  disabled={true}
                  type={showPrivateKey ? 'text' : 'password'}
                  value={privateKey}
                />
              </div>
            </div>
          )}
        </div>

        <div className="Tab-content-pane">
          <div className="row">
            <div className="col-xs-6">
              <label>Public Address</label>
              <div className="well well-lg">
                <QRCode data={address} />
              </div>
            </div>
            {privateKey && (
              <div className="col-xs-6">
                <label>Private Key</label>
                <div className="well well-lg">
                  <QRCode data={privateKey} />
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
}

import { PaperWallet } from 'components';
import PrivKeyWallet from 'libs/wallet/privkey';
import React, { Component } from 'react';
import translate from 'translations';
import printElement from 'utils/printElement';

interface Props {
  wallet: PrivKeyWallet;
}

interface State {
  address: string | null;
  privateKey: string | null;
}

const initialState = {
  address: null,
  privateKey: null
};

export default class PrintableWallet extends Component<Props, {}> {
  public state: State = initialState;

  public async componentDidMount() {
    const address = await this.props.wallet.getAddress();
    const privateKey = this.props.wallet.getPrivateKey();
    this.setState({ address, privateKey });
  }

  public print = () => {
    const { address, privateKey } = this.state;
    if (address && privateKey) {
      printElement(<PaperWallet address={address} privateKey={privateKey} />, {
        popupFeatures: {
          scrollbars: 'no'
        },
        styles: `
        * {
          box-sizing: border-box;
        }

        body {
          font-family: Lato, sans-serif;
          font-size: 1rem;
          line-height: 1.4;
          margin: 0;
        }
      `
      });
    }
  };

  public render() {
    const { address, privateKey } = this.state;
    return address && privateKey ? (
      <div>
        <PaperWallet address={address} privateKey={privateKey} />
        <a
          role="button"
          aria-label={translate('x_Print')}
          aria-describedby="x_PrintDesc"
          className={'btn btn-lg btn-primary'}
          onClick={this.print}
          style={{ marginTop: 10 }}
        >
          {translate('x_Print')}
        </a>
      </div>
    ) : null;
  }
}

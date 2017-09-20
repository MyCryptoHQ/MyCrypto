import { PaperWallet } from 'components';
import PrivKeyWallet from 'libs/wallet/privkey';
import React, { Component } from 'react';
import translate from 'translations';
import printElement from 'utils/printElement';

interface Props {
  wallet: PrivKeyWallet;
}

export default class PrintableWallet extends Component<Props, {}> {
  public print = () => {
    printElement(<PaperWallet wallet={this.props.wallet} />, {
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
  };

  public render() {
    return (
      <div>
        <PaperWallet wallet={this.props.wallet} />
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
    );
  }
}

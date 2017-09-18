// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';
import printElement from 'utils/printElement';
import { PaperWallet } from 'components';
import type PrivKeyWallet from 'libs/wallet/privkey';

type Props = {
  wallet: PrivKeyWallet
};

export default class PrintableWallet extends Component {
  props: Props;
  static propTypes = {
    wallet: PropTypes.object.isRequired
  };

  print = () => {
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

  render() {
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

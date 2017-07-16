// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';
import PrintableWallet from 'components/PrintableWallet';
import type PrivKeyWallet from 'libs/wallet/privkey';
import { Link } from 'react-router';

type Props = {
  wallet: PrivKeyWallet
};

export default class PaperWallet extends Component {
  props: Props;

  static propTypes = {
    // Store state
    wallet: PropTypes.object.isRequired
  };

  render() {
    const { wallet } = this.props;

    return (
      <div className="col-sm-8 col-sm-offset-2">
        {/* Private Key */}
        <h1>
          {translate('GEN_Label_5')}
        </h1>
        <input
          value={wallet.getPrivateKey()}
          aria-label={translate('x_PrivKey')}
          aria-describedby="x_PrivKeyDesc"
          className="form-control"
          type="text"
          readOnly="readonly"
        />
        <br />

        {/* Download Paper Wallet */}
        <h1>
          {translate('x_Print')}
        </h1>
        <PrintableWallet wallet={wallet} />
        <br />
        <br />

        {/* Continue button */}
        <Link className="btn btn-default" to={'view-wallet'}>
          View Wallet Info ->
        </Link>
      </div>
    );
  }
}

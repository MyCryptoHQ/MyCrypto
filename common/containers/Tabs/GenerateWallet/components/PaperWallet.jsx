// @flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import translate from "translations";
import PrintableWallet from "components/PrintableWallet";
import type PrivKeyWallet from "libs/wallet/privkey";

type Props = {
  wallet: PrivKeyWallet,
  continueToUnlockWallet: () => any
};

export default class PaperWallet extends Component {
  props: Props;
  static propTypes = {
    // Store state
    wallet: PropTypes.object.isRequired,
    // Actions
    continueToUnlockWallet: PropTypes.func
  };

  render() {
    const { wallet, continueToUnlockWallet } = this.props;

    return (
      <div className="col-sm-8 col-sm-offset-2">
        {/* Private Key */}
        <h1>
          {translate("GEN_Label_5")}
        </h1>
        <input
          value={wallet.getPrivateKey()}
          aria-label={translate("x_PrivKey")}
          aria-describedby="x_PrivKeyDesc"
          className="form-control"
          type="text"
          readOnly="readonly"
        />
        <br />

        {/* Download Paper Wallet */}
        <h1>
          {translate("x_Print")}
        </h1>
        <PrintableWallet wallet={wallet} />
        <br />
        <br />

        {/* Continue button */}
        <button className="btn btn-default" onClick={continueToUnlockWallet}>
          {translate("GEN_Label_3")} →
        </button>
      </div>
    );
  }
}

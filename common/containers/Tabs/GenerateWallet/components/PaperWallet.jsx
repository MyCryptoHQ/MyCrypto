import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';

export default class PaperWallet extends Component {
  static propTypes = {
    privateKey: PropTypes.node,
  };

  showPaperWallet = () => {
    alert("Implement me!");
  };

  continue = () => {
    alert("Implement me!");
  };

  render() {
    const { privateKey } = this.props;

    return (
      <div>
        {/* Private Key */}
        <h1>
          {translate('GEN_Label_5')}
        </h1>
        <input
          value={privateKey}
          aria-label={translate('x_PrivKey')}
          aria-describedby="x_PrivKeyDesc"
          className="form-control"
          type="text"
          readOnly="readonly"
          style={{ maxWidth: "50em", margin: "0 auto" }}
        />
        <br />

        {/* Download Paper Wallet */}
        <h1>
          {translate('x_Print')}
        </h1>
        <a
          tabIndex="0"
          aria-label={translate('x_Print')}
          aria-describedby="x_PrintDesc"
          role="button"
          className="btn btn-lg btn-primary"
          onClick={this.showPaperWallet}
        >
          {translate('x_Print')}
        </a>
        <br />
        <br />

        {/* Continue button */}
        <button className="btn btn-default" onClick={this.continue}>
          {translate('GEN_Label_3')} →
        </button>
      </div>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';

export default class PaperWallet extends Component {
  static propTypes = {};

  render() {
    const privateKey = 'Make this work';

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
          className="btn btn-primary ng-scope"
        >
          {translate('x_Print')}
        </a>
        <br />
        <br />

        {/* Continue button */}
        <button className="btn btn-default btn-sm">
          {translate('GEN_Label_3')} →
        </button>
      </div>
    );
  }
}

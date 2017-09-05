// @flow
import './PaperWallet.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';
import PrintableWallet from 'components/PrintableWallet';
import type PrivKeyWallet from 'libs/wallet/privkey';
import { Link } from 'react-router';
import Template from './Template';

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

    const content = (
      <div className="GenPaper">
        {/* Private Key */}
        <h1 className="GenPaper-title">
          {translate('GEN_Label_5')}
        </h1>
        <input
          className="GenPaper-private form-control"
          value={wallet.getPrivateKey()}
          aria-label={translate('x_PrivKey')}
          aria-describedby="x_PrivKeyDesc"
          type="text"
          readOnly="readonly"
        />

        {/* Download Paper Wallet */}
        <h1 className="GenPaper-title">
          {translate('x_Print')}
        </h1>
        <div className="GenPaper-paper">
          <PrintableWallet wallet={wallet} />
        </div>

        {/* Warning */}
        <div className="GenPaper-warning">
          <p>
            <strong>Do not lose it!</strong> It cannot be recovered if you lose
            it.
          </p>
          <p>
            <strong>Do not share it!</strong> Your funds will be stolen if you
            use this file on a malicious/phishing site.
          </p>
          <p>
            <strong>Make a backup!</strong> Secure it like the millions of
            dollars it may one day be worth.
          </p>
        </div>

        {/* Continue button */}
        <Link className="GenPaper-continue btn btn-default" to="/view-wallet">
          {translate('NAV_ViewWallet')} →
        </Link>
      </div>
    );

    const help = (
      <div>
        <h4>
          {translate('GEN_Help_4')}
        </h4>
        <ul>
          <li>
            <a
              href="https://myetherwallet.groovehq.com/knowledge_base/topics/how-do-i-save-slash-backup-my-wallet"
              target="_blank"
              rel="noopener"
            >
              <strong>
                {translate('HELP_2a_Title')}
              </strong>
            </a>
          </li>
          <li>
            <a
              href="https://myetherwallet.groovehq.com/knowledge_base/topics/protecting-yourself-and-your-funds"
              target="_blank"
              rel="noopener"
            >
              <strong>
                {translate('GEN_Help_15')}
              </strong>
            </a>
          </li>
          <li>
            <a
              href="https://myetherwallet.groovehq.com/knowledge_base/topics/what-are-the-different-formats-of-a-private-key"
              target="_blank"
              rel="noopener"
            >
              <strong>
                {translate('GEN_Help_16')}
              </strong>
            </a>
          </li>
        </ul>

        <h4>
          {translate('GEN_Help_17')}
        </h4>
        <ul>
          <li>
            {translate('GEN_Help_18')}
          </li>
          <li>
            {translate('GEN_Help_19')}
          </li>
          <li>
            <a
              href="https://myetherwallet.groovehq.com/knowledge_base/topics/how-do-i-safely-slash-offline-slash-cold-storage-with-myetherwallet"
              target="_blank"
              rel="noopener"
            >
              {translate('GEN_Help_20')}
            </a>
          </li>
        </ul>

        <h4>
          {translate('x_PrintDesc')}
        </h4>
      </div>
    );

    return <Template content={content} help={help} />;
  }
}

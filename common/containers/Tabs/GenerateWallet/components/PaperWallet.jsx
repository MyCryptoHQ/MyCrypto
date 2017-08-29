// @flow
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
      <div>
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

import PrintableWallet from 'components/PrintableWallet';
import { IFullWallet } from 'ethereumjs-wallet';
import React from 'react';
import translate from 'translations';
import { stripHexPrefix } from 'libs/values';
import './PaperWallet.scss';
import Template from '../Template';

interface Props {
  wallet: IFullWallet;
  continue(): void;
}

const PaperWallet: React.SFC<Props> = props => (
  <Template>
    <div className="GenPaper">
      {/* Private Key */}
      <h1 className="GenPaper-title">{translate('GEN_Label_5')}</h1>
      <input
        className="GenPaper-private form-control"
        value={stripHexPrefix(props.wallet.getPrivateKeyString())}
        aria-label={translate('x_PrivKey')}
        aria-describedby="x_PrivKeyDesc"
        type="text"
        readOnly={true}
      />

      {/* Download Paper Wallet */}
      <h1 className="GenPaper-title">{translate('x_Print')}</h1>
      <div className="GenPaper-paper">
        <PrintableWallet wallet={props.wallet} />
      </div>

      {/* Warning */}
      <div className="GenPaper-warning">
        <p>
          <strong>Do not lose it!</strong> It cannot be recovered if you lose it.
        </p>
        <p>
          <strong>Do not share it!</strong> Your funds will be stolen if you use this file on a
          malicious/phishing site.
        </p>
        <p>
          <strong>Make a backup!</strong> Secure it like the millions of dollars it may one day be
          worth.
        </p>
      </div>

      {/* Continue button */}
      <button className="GenPaper-continue btn btn-default" onClick={props.continue}>
        {translate('NAV_ViewWallet')} →
      </button>
    </div>
  </Template>
);

export default PaperWallet;

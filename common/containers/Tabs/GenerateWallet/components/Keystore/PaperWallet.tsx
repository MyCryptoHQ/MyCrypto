import PrintableWallet from 'components/PrintableWallet';
import { IV3Wallet } from 'ethereumjs-wallet';
import React from 'react';
import translate, { translateRaw } from 'translations';
import { stripHexPrefix } from 'libs/values';
import './PaperWallet.scss';
import Template from '../Template';
import { Input } from 'components/ui';

interface Props {
  keystore: IV3Wallet;
  privateKey: string;
  continue(): void;
}

const PaperWallet: React.SFC<Props> = props => (
  <Template>
    <div className="GenPaper">
      {/* Private Key */}
      <label className="input-group GenPaper-private">
        {/* translateRaw isn't used here because it wont properly render the ` characters as a string of code in markdown*/}
        <h1 className="input-group-header">{translate('GEN_Label_5')}</h1>
        <Input
          value={stripHexPrefix(props.privateKey)}
          aria-label={translateRaw('x_PrivKey')}
          aria-describedby="x_PrivKeyDesc"
          type="text"
          readOnly={true}
        />
      </label>

      {/* Download Paper Wallet */}
      <h2 className="GenPaper-title">{translate('x_Print')}</h2>
      <div className="GenPaper-paper">
        <PrintableWallet address={props.keystore.address} privateKey={props.privateKey} />
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

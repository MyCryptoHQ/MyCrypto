import PrintableWallet from 'components/PrintableWallet';
import { IV3Wallet } from 'ethereumjs-wallet';
import React from 'react';
import translate from 'translations';
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
          aria-label={translate('x_PrivKey')}
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
        <p>{translate('DL_WALLET_WARNING_1', {}, true)}</p>
        <p>{translate('DL_WALLET_WARNING_2', {}, true)}</p>
        <p>{translate('DL_WALLET_WARNING_3', {}, true)}</p>
      </div>

      {/* Continue button */}
      <button className="GenPaper-continue btn btn-default" onClick={props.continue}>
        {translate('NAV_ViewWallet')} →
      </button>
    </div>
  </Template>
);

export default PaperWallet;

import PrintableWallet from 'components/PrintableWallet';
import { IV3Wallet } from 'ethereumjs-wallet';
import React from 'react';
import translate, { translateRaw } from 'translations';
import { stripHexPrefix } from 'libs/values';
import './PaperWallet.scss';
import Template from '../Template';
import { Input } from 'components/ui';
import { NetworkConfig } from 'types/network';

interface Props {
  keystore: IV3Wallet;
  privateKey: string;
  network: NetworkConfig;
  continue(): void;
}

const PaperWallet: React.SFC<Props> = props => (
  <Template>
    <div className="GenPaper">
      {/* Private Key */}
      <label className="input-group GenPaper-private">
        <h1 className="GenPaper-title">{translate('GEN_LABEL_5')}</h1>
        <Input
          value={stripHexPrefix(props.privateKey)}
          showValidAsPlain={true}
          isValid={true}
          aria-label={translateRaw('X_PRIVKEY')}
          aria-describedby="x_PrivKeyDesc"
          type="text"
          readOnly={true}
        />
      </label>

      {/* Download Paper Wallet */}
      <h2 className="GenPaper-title">{translate('X_PRINT')}</h2>
      <div className="GenPaper-paper">
        <PrintableWallet
          address={props.keystore.address}
          privateKey={props.privateKey}
          network={props.network}
        />
      </div>

      {/* Warning */}
      <div className="GenPaper-warning">
        <p>{translate('DL_WALLET_WARNING_1')}</p>
        <p>{translate('DL_WALLET_WARNING_2')}</p>
        <p>{translate('DL_WALLET_WARNING_3')}</p>
      </div>

      {/* Continue button */}
      <button className="GenPaper-continue btn btn-default" onClick={props.continue}>
        {translate('NAV_VIEWWALLET')} →
      </button>
    </div>
  </Template>
);

export default PaperWallet;

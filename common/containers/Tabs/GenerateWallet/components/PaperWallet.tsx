import PrintableWallet from 'components/PrintableWallet';
import { IFullWallet } from 'ethereumjs-wallet';
import { NewTabLink } from 'components/ui';
import React from 'react';
import { Link } from 'react-router-dom';
import translate from 'translations';
import { stripHexPrefix } from 'libs/values';
import './PaperWallet.scss';
import Template from './Template';
import { knowledgeBaseURL } from 'config/data';

const content = (wallet: IFullWallet) => (
  <div className="GenPaper">
    {/* Private Key */}
    <h1 className="GenPaper-title">{translate('GEN_Label_5')}</h1>
    <input
      className="GenPaper-private form-control"
      value={stripHexPrefix(wallet.getPrivateKeyString())}
      aria-label={translate('x_PrivKey')}
      aria-describedby="x_PrivKeyDesc"
      type="text"
      readOnly={true}
    />

    {/* Download Paper Wallet */}
    <h1 className="GenPaper-title">{translate('x_Print')}</h1>
    <div className="GenPaper-paper">
      <PrintableWallet wallet={wallet} />
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
    <Link className="GenPaper-continue btn btn-default" to="/view-wallet">
      {translate('NAV_ViewWallet')} →
    </Link>
  </div>
);

const help = (
  <div>
    <h4>{translate('GEN_Help_4')}</h4>
    <ul>
      <li>
        <NewTabLink href={`${knowledgeBaseURL}/getting-started/backing-up-your-new-wallet`}>
          <strong>{translate('HELP_2a_Title')}</strong>
        </NewTabLink>
      </li>
      <li>
        <NewTabLink href={`${knowledgeBaseURL}/security/securing-your-ethereum`}>
          <strong>{translate('GEN_Help_15')}</strong>
        </NewTabLink>
      </li>
      <li>
        <NewTabLink
          href={`${knowledgeBaseURL}/private-keys-passwords/difference-beween-private-key-and-keystore-file`}
        >
          <strong>{translate('GEN_Help_16')}</strong>
        </NewTabLink>
      </li>
    </ul>

    <h4>{translate('GEN_Help_17')}</h4>
    <ul>
      <li>{translate('GEN_Help_18')}</li>
      <li>{translate('GEN_Help_19')}</li>
      <li>
        <NewTabLink href={`${knowledgeBaseURL}/offline/ethereum-cold-storage-with-myetherwallet`}>
          {translate('GEN_Help_20')}
        </NewTabLink>
      </li>
    </ul>

    <h4>{translate('x_PrintDesc')}</h4>
  </div>
);

const PaperWallet: React.SFC<{
  wallet: IFullWallet;
}> = ({ wallet }) => <Template content={content(wallet)} help={help} />;

export default PaperWallet;

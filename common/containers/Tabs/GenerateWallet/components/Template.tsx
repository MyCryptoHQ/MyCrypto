import React from 'react';
import { Link } from 'react-router-dom';

import translate from 'translations';
import './Template.scss';

interface Props {
  hideBack?: boolean;
  children: React.ReactElement<any>;
  onBack?(ev: React.MouseEvent<HTMLAnchorElement>): void;
}

const GenerateWalletTemplate: React.SFC<Props> = ({ children, hideBack, onBack }) => (
  <div className="GenerateWallet Tab-content-pane">
    {children}
    {!hideBack && (
      <Link className="GenerateWallet-back" to="/generate" onClick={onBack}>
        <i className="fa fa-arrow-left" /> {translate('MODAL_BACK')}
      </Link>
    )}
  </div>
);

export default GenerateWalletTemplate;

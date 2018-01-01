import React from 'react';
import { Link } from 'react-router-dom';
import './Template.scss';

interface Props {
  children: React.ReactElement<any>;
}

const GenerateWalletTemplate: React.SFC<Props> = ({ children }) => (
  <div className="GenerateWallet Tab-content-pane">
    {children}
    <Link className="GenerateWallet-back" to="/generate">
      <i className="fa fa-arrow-left" /> Back
    </Link>
  </div>
);

export default GenerateWalletTemplate;

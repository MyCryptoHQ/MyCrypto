import React from 'react';
import { Link } from 'react-router-dom';

import './GetStartedPanel.scss';

export default function GetStartedPanel() {
  return (
    <section className="GetStartedPanel">
      <h1>
        Let's get started! <br /> Select an option below:
      </h1>
      <div className="GetStartedPanel-options">
        <Link to="/create-wallet" className="GetStartedPanel-options-option">
          I'm new! Create new wallet
        </Link>
        <Link to="/import-wallet" className="GetStartedPanel-options-option">
          I need to import an existing wallet
        </Link>
      </div>
      <div className="GetStartedPanel-alreadyHaveAccount">I have a MyCrypto Account</div>
    </section>
  );
}

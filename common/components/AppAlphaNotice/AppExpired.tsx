import React from 'react';
import { NewTabLink } from 'components/ui';
import './AppExpired.scss';

const AppExpired: React.SFC<{}> = () => (
  <div className="AppExpired">
    <div className="AppExpired-content">
      <h2>Your Alpha Build Has Expired</h2>
      <p>
        To ensure the safety of your funds, we are expiring alpha builds one month after release and
        requiring users to update. All you have to do is download a new build from our GitHub, and
        you can continue to use the app. Sorry for the hassle!
      </p>

      <NewTabLink
        href="https://github.com/MyCryptoHQ/MyCrypto/releases/latest"
        className="AppExpired-content-btn"
      >
        Download a New Build
      </NewTabLink>
    </div>
  </div>
);

export default AppExpired;

import React from 'react';

import { APP_ALPHA_EXPIRATION } from 'config';
import AlphaNotice from './AlphaNotice';
import AppExpired from './AppExpired';

const AppAlphaNotice: React.SFC<{}> = () => {
  if (APP_ALPHA_EXPIRATION < Date.now()) {
    return <AppExpired />;
  } else {
    return <AlphaNotice />;
  }
};

export default AppAlphaNotice;

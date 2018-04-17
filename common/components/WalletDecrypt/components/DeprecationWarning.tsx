import React from 'react';
import translate from 'translations';

const DeprecationWarning: React.SFC<{}> = () => {
  if (process.env.BUILD_DOWNLOADABLE) {
    return null;
  }

  return <div className="alert alert-warning">{translate('INSECURE_WALLET_DEPRECATION')}</div>;
};

export default DeprecationWarning;

import React from 'react';
import './index.scss';

const SUBJECT = 'Error!';
const DESCRIPTION =
  'I encountered an error while using MyEtherWallet. Here are the steps to re-create the issue: ...';

const ErrorScreen: React.SFC<{}> = () => {
  return (
    <div className="ErrorScreen">
      <div className="ErrorScreen-content">
        <h2>Oops!</h2>
        <p>Something went really wrong, so we're showing you this red error page! 😱</p>
        <p>
          Please contact{' '}
          <a
            target="_blank"
            rel="noopener"
            href={`mailto:support@myetherwallet.com?Subject=${SUBJECT}&body=${DESCRIPTION}`}
          >
            support@myetherwallet.com
          </a>{' '}
          if a refresh doesn't fix it (or click it anyway to open a ticket 😊 ).
        </p>
      </div>
    </div>
  );
};

export default ErrorScreen;

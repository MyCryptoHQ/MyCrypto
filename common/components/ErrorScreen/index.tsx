import React from 'react';
import './index.scss';

const SUBJECT = 'Error!';
const DESCRIPTION =
  'I encountered an error while using MyEtherWallet. Here are the steps to re-create the issue:\n\nThe full error message:';

interface Props {
  error: Error;
}

const ErrorScreen: React.SFC<Props> = ({ error }) => {
  return (
    <div className="ErrorScreen">
      <div className="ErrorScreen-content">
        <h2>Oops!</h2>
        <p>Something went really wrong, so we're showing you this red error page! 😱</p>
        <p>
          Please contact{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`mailto:support@myetherwallet.com?Subject=${SUBJECT}&body=${DESCRIPTION}`}
          >
            support@myetherwallet.com
          </a>{' '}
          if a refresh doesn't fix it (or click it anyway to open a ticket 😊). If you attach the
          following error, you'll make it a ton easier to fix the issue.
        </p>
        <h5>
          Please make sure the error message does not include any sensitive information before
          sending it us. We don't want your private keys!
        </h5>
        <code>{error.message}</code>
      </div>
    </div>
  );
};

export default ErrorScreen;

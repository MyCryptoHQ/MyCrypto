import * as React from 'react';
import { BalanceSidebar } from 'components';

interface Props {
  children: JSX.Element;
}

const ENSUnlockLayout = (props: Props) => {
  const { children } = props;
  return (
    <div>
      <div className="col-sm-8">{children}</div>
      <div className="col-sm-4">
        <BalanceSidebar />
      </div>
    </div>
  );
};

export default ENSUnlockLayout;

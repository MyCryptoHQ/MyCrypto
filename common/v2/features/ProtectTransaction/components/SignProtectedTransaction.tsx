import React, { FC } from 'react';
import ProtectIcon from './icons/ProtectIcon';

import './SignProtectedTransaction.scss';

export const SignProtectedTransaction: FC = ({ children }) => {
  return (
    <div className="SignProtectedTransaction">
      <ProtectIcon size="lg" />
      {children}
    </div>
  );
};

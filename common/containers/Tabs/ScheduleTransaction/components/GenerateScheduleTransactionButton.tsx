import React from 'react';
import translate from 'translations';
import { ScheduleTransactionFactory } from './ScheduleTransactionFactory';

export const GenerateScheduleTransactionButton: React.SFC<{}> = () => {
  return (
    <ScheduleTransactionFactory
      withProps={({ disabled, isWeb3Wallet, onClick }) => (
        <button disabled={disabled} className="btn btn-info btn-block" onClick={onClick}>
          {isWeb3Wallet ? translate('SCHEDULE_SCHEDULE') : translate('DEP_signtx')}
        </button>
      )}
    />
  );
};

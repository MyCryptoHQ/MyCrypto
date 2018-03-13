import { ScheduleTransactionFactory } from './ScheduleTransactionFactory';
import React from 'react';
import translate from 'translations';

export const ScheduleTransaction: React.SFC<{}> = () => (
  <ScheduleTransactionFactory
    withProps={({ disabled, isWeb3Wallet, onClick }) => (
      <button disabled={disabled} className="btn btn-info btn-block" onClick={onClick}>
        {isWeb3Wallet ? translate('SCHEDULE_schedule') : translate('DEP_signtx')}
      </button>
    )}
  />
);

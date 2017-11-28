import React from 'react';
import translate from 'translations';
import { SignedTransaction } from './Container';
import { Aux } from 'components/ui';
import { getTransactionFields, transaction } from 'libs/transaction';

const getStringifiedTx = (signedTransaction: string) =>
  JSON.stringify(getTransactionFields(transaction(signedTransaction)), null, 2);

export const TransactionComparison: React.SFC<{}> = () => (
  <SignedTransaction
    withSignedTransaction={({ signedTransaction }) => (
      <Aux>
        <div className="col-sm-6">
          <label>{translate('SEND_raw')}</label>
          <textarea
            className="form-control"
            value={getStringifiedTx(signedTransaction)}
            rows={4}
            readOnly={true}
          />
        </div>
        <div className="col-sm-6">
          <label>{translate('SEND_signed')}</label>
          <textarea
            className="form-control"
            value={signedTransaction}
            rows={4}
            readOnly={true}
          />
        </div>
      </Aux>
    )}
  />
);

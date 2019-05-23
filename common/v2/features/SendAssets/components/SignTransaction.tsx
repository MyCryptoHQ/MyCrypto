import React from 'react';
import { ISendState, ITxFields } from '../types';

interface Props {
  stateValues: ISendState;
  transactionFields: ITxFields;
}

export default function SignTransaction({ transactionFields }: Props) {
  // const recipientLabel = 'unknown';
  // const senderLabel = 'unknown';

  return (
    <div className="ConfirmTransaction">
      <div className="ConfirmTransaction-row">
        <div className="ConfirmTransaction-row-column">
          <div className="ConfirmTransaction-addressWrapper">{transactionFields.senderAddress}</div>
        </div>
      </div>
    </div>
  );
}

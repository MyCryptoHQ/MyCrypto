import React from 'react';

import { ShapeShiftSendField } from '../components';
import { ShapeShiftSendRenderProps } from '../types';

// Legacy
import translate, { translateRaw } from 'v2/translations';
import { Warning } from 'v2/components';

export const generateSendScreenLayout = (props: ShapeShiftSendRenderProps) => {
  const {
    transaction: { deposit, sAddress },
    sendField,
    timeField,
    receiveAmountField,
    rateField,
    referenceNumberField,
    statusField
  } = props;

  return (
    <React.Fragment>
      {sendField}
      <ShapeShiftSendField
        dark={true}
        label={translateRaw('USING_PAYMENT_ID')}
        value={deposit}
        className="smallest"
      />
      <ShapeShiftSendField dark={true}>
        <Warning highlighted={true}>{translate('PAYMENT_ID_WARNING')}</Warning>
      </ShapeShiftSendField>
      <ShapeShiftSendField
        dark={true}
        label="to this address"
        value={sAddress}
        className="smallest"
      />
      {timeField}
      {receiveAmountField}
      {rateField}
      {referenceNumberField}
      {statusField}
    </React.Fragment>
  );
};

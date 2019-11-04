import React from 'react';

import { BitcoinQR, ShapeShiftSendField } from '../components';
import { ShapeShiftSendRenderProps } from '../types';

export const generateSendScreenLayout = (props: ShapeShiftSendRenderProps) => {
  const {
    transaction: { deposit, depositAmount },
    sendField,
    addressField,
    timeField,
    receiveAmountField,
    rateField,
    referenceNumberField,
    statusField
  } = props;

  return (
    <React.Fragment>
      {sendField}
      {addressField}
      <ShapeShiftSendField dark={true}>
        <BitcoinQR paymentAddress={deposit} destinationAmount={parseFloat(depositAmount)} />
      </ShapeShiftSendField>
      {timeField}
      {receiveAmountField}
      {rateField}
      {referenceNumberField}
      {statusField}
    </React.Fragment>
  );
};

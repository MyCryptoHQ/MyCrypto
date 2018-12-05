import React from 'react';

import { BitcoinQR, ShapeShiftSendField } from '../components';
import { ShapeShiftSendRenderProps } from '../types';

export const generateSendScreenLayout = (props: ShapeShiftSendRenderProps) => {
  const {
    sendField,
    addressField,
    timeField,
    receiveAmountField,
    rateField,
    referenceNumberField,
    statusField,
    transaction: { deposit, depositAmount }
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

import React from 'react';

import { ShapeShiftSendRenderProps } from '../types';

export const generateSendScreenLayout = (props: ShapeShiftSendRenderProps) => {
  const {
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
      {timeField}
      {receiveAmountField}
      {rateField}
      {referenceNumberField}
      {statusField}
    </React.Fragment>
  );
};

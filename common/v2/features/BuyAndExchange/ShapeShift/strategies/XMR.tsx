import React from 'react';

import { ShapeShiftSendField } from '../components';
import { ShapeShiftSendRenderProps } from '../types';

// Legacy
import translate, { translateRaw } from 'translations';
import { Warning } from 'components/ui';

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
      <ShapeShiftSendField
        dark={true}
        label={translateRaw('USING_PAYMENT_ID')}
        value="123"
        className="smallest"
      />
      <ShapeShiftSendField dark={true}>
        <Warning highlighted={true}>{translate('PAYMENT_ID_WARNING')}</Warning>
      </ShapeShiftSendField>
      {addressField}
      {timeField}
      {receiveAmountField}
      {rateField}
      {referenceNumberField}
      {statusField}
    </React.Fragment>
  );
};

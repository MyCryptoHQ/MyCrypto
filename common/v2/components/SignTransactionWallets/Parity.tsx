import React from 'react';

import { ISignComponentProps } from 'v2/types';
import { translateRaw } from 'v2/translations';

export default function SignTransactionParity({}: ISignComponentProps) {
  return <div>{translateRaw('SIGN_TRANSACTION_WITH_PARITY')}</div>;
}

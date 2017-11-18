import React from 'react';
import translate from 'translations';
import { decodeTransaction } from 'libs/transaction';
import EthTx from 'ethereumjs-tx';
import Code from 'components/ui/Code';
export interface Props {
  signedTx: string;
}

export const TxCompare = (props: Props) => {
  if (!props.signedTx) {
    return null;
  }
  const rawTx = decodeTransaction(new EthTx(props.signedTx), false);

  const Left = () => (
    <div className="form-group">
      <h4>{translate('SEND_raw')}</h4>
      <Code>{JSON.stringify(rawTx, null, 2)}</Code>
    </div>
  );
  const Right = () => (
    <div className="form-group">
      <h4> {translate('SEND_signed')} </h4>
      <Code>{props.signedTx}</Code>
    </div>
  );
  return (
    <section>
      <Left />
      <Right />
    </section>
  );
};

export type TTxCompare = typeof TxCompare;

import React from 'react';
import { Wei } from 'libs/units';
import translate from 'translations';
import Code from 'components/ui/Code';
export interface Props {
  nonce: string;
  gasPrice: Wei;
  gasLimit: string;
  to: string;
  value: string;
  data: string;
  chainId: number;
  signedTx: string;
}

export const TxCompare = (props: Props) => {
  if (!props.signedTx) {
    return null;
  }
  const { signedTx, ...rawTx } = props;
  const Left = () => (
    <div className="form-group">
      <h4>{translate('SEND_raw')}</h4>
      <Code>
        {JSON.stringify(
          { ...rawTx, gasPrice: rawTx.gasPrice.toString(16) },
          null,
          2
        )}
      </Code>
    </div>
  );
  const Right = () => (
    <div className="form-group">
      <h4> {translate('SEND_signed')} </h4>
      <Code>{signedTx}</Code>
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

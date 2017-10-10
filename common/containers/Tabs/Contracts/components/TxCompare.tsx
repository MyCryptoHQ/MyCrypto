import React from 'react';
import { Wei } from 'libs/units';
import translate from 'translations';
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
      <textarea
        disabled={true}
        value={JSON.stringify(
          { ...rawTx, gasPrice: rawTx.gasPrice.toString(16) },
          null,
          2
        )}
        rows={3}
      />
    </div>
  );
  const Right = () => (
    <div className="form-group">
      <h4> {translate('SEND_signed')} </h4>
      <textarea disabled={true} value={signedTx} rows={3} />
    </div>
  );
  return (
    <section className="row">
      <Left />
      <Right />
    </section>
  );
};

export type TTxCompare = typeof TxCompare;

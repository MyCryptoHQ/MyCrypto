import * as React from 'react';
import { fromTokenBase, getDecimalFromEtherUnit, Wei, Nonce, Data } from 'libs/units';
import Code from 'components/ui/Code';
import './Details.scss';
import BN from 'bn.js';
import { rawUnitConversion } from 'utils/rawUnitConversion';

interface Props {
  sendValue: BN;
  network: string;
  provider: string;
  gasPrice: any;
  gasLimit: any;
  nonce: any;
  data: any;
  chainId: any;
  decimal: number;
  symbol: string;
}

export const Details: React.SFC<Props> = ({
  sendValue,
  network,
  provider,
  gasPrice,
  gasLimit,
  nonce,
  data,
  chainId,
  decimal,
  symbol
}) => {
  return (
    <div className="tx-modal-details">
      <p className="tx-modal-details-network-info">
        Interacting with the {network} network provided by {provider}
      </p>
      <Code>
        {JSON.stringify(
          {
            amount: rawUnitConversion({ value: sendValue, decimal, symbol }),
            gasPrice: fromTokenBase(Wei(gasPrice), getDecimalFromEtherUnit('gwei')),
            gasLimit: Wei(gasLimit).toString(),
            nonce: Nonce(nonce).toString(),
            chainId,
            data: !!Data(data).toJSON().data.length ? data : ''
          },
          undefined,
          2
        )}
      </Code>
    </div>
  );
};

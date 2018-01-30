import * as React from 'react';
import { fromTokenBase, getDecimalFromEtherUnit, Wei, Nonce, Data } from 'libs/units';
import Code from 'components/ui/Code';
import './Details.scss';

interface Props {
  network: string;
  provider: string;
  gasPrice: any;
  gasLimit: any;
  nonce: any;
  data: any;
  chainId: any;
}

export const Details: React.SFC<Props> = ({
  network,
  provider,
  gasPrice,
  gasLimit,
  nonce,
  data,
  chainId
}) => {
  return (
    <div className="tx-modal-details">
      <p>
        Your interacting with the {network} network provided by {provider}
      </p>
      <Code>
        {JSON.stringify(
          {
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

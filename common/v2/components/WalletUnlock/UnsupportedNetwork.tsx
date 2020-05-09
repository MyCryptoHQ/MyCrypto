import React from 'react';
import { Network } from '@types';
import { Trans } from '@translations';

interface OwnProps {
  walletType: string | React.ReactElement<string>;
  network: Network;
}

type Props = OwnProps;

const UnsupportedNetwork: React.FC<Props> = ({ walletType, network }) => {
  return (
    <h2>
      <Trans
        id="UNSUPPORTED_NETWORK"
        variables={{
          $walletType: () => <>{walletType}</>,
          $networkName: () => network.name
        }}
      />
    </h2>
  );
};

export default UnsupportedNetwork;

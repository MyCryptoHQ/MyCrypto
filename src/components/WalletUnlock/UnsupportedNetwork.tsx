import React from 'react';

import { Trans } from '@translations';
import { Network } from '@types';

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

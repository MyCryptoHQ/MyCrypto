import React from 'react';
import { Network } from 'v2/types';

interface OwnProps {
  walletType: string | React.ReactElement<string>;
  network: Network;
}

type Props = OwnProps;

const UnsupportedNetwork: React.SFC<Props> = ({ walletType, network }) => {
  return (
    <h2>
      {walletType} does not support the {network.name} network
    </h2>
  );
};

export default UnsupportedNetwork;

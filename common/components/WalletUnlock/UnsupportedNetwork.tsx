import React from 'react';
import { INetwork } from 'typeFiles';

interface OwnProps {
  walletType: string | React.ReactElement<string>;
  network: INetwork;
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

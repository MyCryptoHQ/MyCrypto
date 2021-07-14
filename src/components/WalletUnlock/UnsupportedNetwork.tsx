import { FC, ReactElement } from 'react';

import { Trans } from '@translations';
import { Network } from '@types';

interface OwnProps {
  walletType: string | ReactElement<string>;
  network: Network;
}

type Props = OwnProps;

const UnsupportedNetwork: FC<Props> = ({ walletType, network }) => {
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

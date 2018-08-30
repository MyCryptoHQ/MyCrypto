import React from 'react';
import { connect } from 'react-redux';

import { NetworkConfig } from 'types/network';
import { AppState } from 'features/reducers';
import { configSelectors } from 'features/config';

interface StateProps {
  network: NetworkConfig;
}

interface OwnProps {
  walletType: string | React.ReactElement<string>;
}

type Props = OwnProps & StateProps;

const UnsupportedNetwork: React.SFC<Props> = ({ walletType, network }) => {
  return (
    <h2>
      {walletType} does not support the {network.name} network
    </h2>
  );
};

export default connect((state: AppState): StateProps => ({
  network: configSelectors.getNetworkConfig(state)
}))(UnsupportedNetwork);

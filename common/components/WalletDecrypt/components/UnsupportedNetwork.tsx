import React from 'react';
import { connect } from 'react-redux';
import { getNetworkConfig } from 'selectors/config';
import { NetworkConfig } from 'types/network';
import { AppState } from 'reducers';

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
  network: getNetworkConfig(state)
}))(UnsupportedNetwork);

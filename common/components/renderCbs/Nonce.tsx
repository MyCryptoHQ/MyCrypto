import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Offline } from './Offline';
import { getNodeLib } from 'selectors/config';
import { getWallet } from 'selectors/wallet';
import { INode } from 'libs/nodes/INode';
import { AppState } from 'reducers';

interface OwnProps {
  withNonce({ nonce }: { nonce: Promise<string | null> }): React.ReactElement<any> | null;
}
interface StateProps {
  nodeLib: AppState['config']['node']['lib'];
  wallet: AppState['wallet'];
}

function mapStateToProps(state: AppState) {
  return {
    nodeLib: getNodeLib(state),
    wallet: getWallet(state)
  };
}

class componentName extends Component<OwnProps & StateProps> {
  public render() {
    return <div />;
  }
}

export default connect(mapStateToProps)(componentName);

const nullPromise = { nonce: Promise.resolve(null) };
export const Nonce: React.SFC<Props> = ({ withNonce }) => {
  const nonceGetter = (
    <NodeLib
      withNodeLib={({ nodeLib }) => (
        <Wallet
          withWallet={({ wallet }) => {
            if (!wallet.inst) {
              return withNonce(nullPromise);
            } else {
              const noncePromise = Promise.resolve(wallet.inst.getAddressString())
                .then(address => {
                  return nodeLib.getTransactionCount(address);
                })
                .catch(_ => null);
              return withNonce({ nonce: noncePromise });
            }
          }}
        />
      )}
    />
  );

  return (
    <Offline withOffline={({ offline }) => (offline ? withNonce(nullPromise) : nonceGetter)} />
  );
};

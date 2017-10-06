import * as configSelectors from 'selectors/config';
import { AppState } from 'reducers';
import { GWei, Wei, Ether } from 'libs/units';
import { connect } from 'react-redux';
import { showNotification, TShowNotification } from 'actions/notifications';
import { broadcastTx, TBroadcastTx } from 'actions/wallet';
import { IWallet } from 'libs/wallet/IWallet';
import { RPCNode } from 'libs/nodes';
import { NodeConfig, NetworkConfig } from 'config/data';

export interface IWithTx {
  wallet: IWallet;
  balance: Ether;
  node: NodeConfig;
  nodeLib: RPCNode;
  chainId: NetworkConfig['chainId'];
  networkName: NetworkConfig['name'];
  gasPrice: Wei;
  broadcastTx: TBroadcastTx;
  showNotification: TShowNotification;
}

const mapStateToProps = (state: AppState) => ({
  wallet: state.wallet.inst,
  balance: state.wallet.balance,
  node: configSelectors.getNodeConfig(state),
  nodeLib: configSelectors.getNodeLib(state),
  chainId: configSelectors.getNetworkConfig(state).chainId,
  networkName: configSelectors.getNetworkConfig(state).name,
  gasPrice: new GWei(configSelectors.getGasPriceGwei(state)).toWei()
});

export const withTx = passedComponent =>
  connect(mapStateToProps, {
    showNotification,
    broadcastTx
  })(passedComponent);

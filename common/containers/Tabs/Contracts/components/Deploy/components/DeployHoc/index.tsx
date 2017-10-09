import * as configSelectors from 'selectors/config';
import { AppState } from 'reducers';
import { GWei } from 'libs/units';
import { connect } from 'react-redux';
import { showNotification } from 'actions/notifications';
import { broadcastTx } from 'actions/wallet';
import { deployHOC } from './DeployHoc';

const mapStateToProps = (state: AppState) => ({
  wallet: state.wallet.inst,
  balance: state.wallet.balance,
  node: configSelectors.getNodeConfig(state),
  nodeLib: configSelectors.getNodeLib(state),
  chainId: configSelectors.getNetworkConfig(state).chainId,
  networkName: configSelectors.getNetworkConfig(state).name,
  gasPrice: new GWei(configSelectors.getGasPriceGwei(state)).toWei()
});

export default passedComponent =>
  connect(mapStateToProps, {
    showNotification,
    broadcastTx
  })(deployHOC(passedComponent));

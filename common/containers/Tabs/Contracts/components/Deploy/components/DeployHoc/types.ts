import { Wei } from 'libs/units';
import { Balance } from 'libs/wallet';
import { RPCNode } from 'libs/nodes';
import { NodeConfig, NetworkConfig } from 'config/data';
import { TBroadcastTx } from 'actions/wallet';
import { TShowNotification } from 'actions/notifications';
import { AppState } from 'reducers';

export interface Props {
  wallet: AppState['wallet']['inst'];
  balance: Balance;
  node: NodeConfig;
  nodeLib: RPCNode;
  chainId: NetworkConfig['chainId'];
  networkName: NetworkConfig['name'];
  gasPrice: Wei;
  broadcastTx: TBroadcastTx;
  showNotification: TShowNotification;
}

export interface State {
  data: string;
  gasLimit: string;
  determinedContractAddress: string;
  signedTx: null | string;
  nonce: null | string;
  address: null | string;
  value: string;
  to: string;
  displayModal: boolean;
}

export const initialState: State = {
  data: '',
  gasLimit: '300000',
  determinedContractAddress: '',
  signedTx: null,
  nonce: null,
  address: null,
  to: '0x',
  value: '0x0',
  displayModal: false
};

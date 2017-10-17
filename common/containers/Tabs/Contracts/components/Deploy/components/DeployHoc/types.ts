import { Wei, Ether } from 'libs/units';
import { IWallet } from 'libs/wallet/IWallet';
import { RPCNode } from 'libs/nodes';
import { NodeConfig, NetworkConfig } from 'config/data';
import { TBroadcastTx } from 'actions/wallet';
import { TShowNotification } from 'actions/notifications';

export interface Props {
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

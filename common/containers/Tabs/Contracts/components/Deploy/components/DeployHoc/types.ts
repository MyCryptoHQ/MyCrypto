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
  network: NetworkConfig;
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

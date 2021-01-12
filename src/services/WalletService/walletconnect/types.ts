import { ITxData } from '@walletconnect/types';
import { ValuesType } from 'utility-types';

import { ITxObject, TAddress } from '@types';

import { WcReducer } from './reducer';

export type TActionError = ValuesType<typeof WcReducer.errorCodes>;

export interface WalletConnectState {
  detectedAddress?: TAddress;
  detectedChainId?: number;
  uri?: string;
  errors?: TActionError[];
  isConnected: boolean;
  isPendingSign: boolean;
  promptConnectionRetry: boolean;
  promptSignRetry: boolean;
}

export interface IWalletConnectService {
  isConnected: boolean;
  init(): Promise<void>;
  kill(): Promise<void>;
  sendTx(tx: ITxData): Promise<string>;
  signMessage(msg: string, address: string): Promise<string>;
}

export interface IUseWalletConnect {
  state: WalletConnectState;
  requestSign(tx: ITxObject & { from: TAddress }): Promise<string>;
  requestConnection(): void;
  signMessage(props: ISignMsgProps): Promise<string>;
}
interface ISignMsgProps {
  msg: string;
  address: string;
}

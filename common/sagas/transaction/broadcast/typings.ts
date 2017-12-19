import { AppState } from 'reducers';
import {
  BroadcastWeb3TransactionRequestedAction,
  BroadcastLocalTransactionRequestedAction
} from 'actions/transaction';

type SignState = AppState['transaction']['sign'];
type BroadcastRequestedAction =
  | BroadcastWeb3TransactionRequestedAction
  | BroadcastLocalTransactionRequestedAction;
type StateSerializedTx = SignState['local']['signedTransaction'] | SignState['web3']['transaction'];
interface ISerializedTxAndIndexingHash {
  serializedTransaction: Buffer;
  indexingHash: string;
}

export { BroadcastRequestedAction, StateSerializedTx, ISerializedTxAndIndexingHash };

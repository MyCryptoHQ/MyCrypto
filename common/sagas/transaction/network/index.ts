import { from } from './from';
import { gas } from './gas';
import { nonce } from './nonce';
import { schedulingTransactionNetworkSagas } from '../../../containers/Tabs/ScheduleTransaction/sagas/transaction/network';

export const network = [from, ...gas, nonce, ...schedulingTransactionNetworkSagas];

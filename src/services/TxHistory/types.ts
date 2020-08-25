import { Overwrite } from 'utility-types';

import { ITxReceipt, ExtendedAddressBook, Network } from '@types';
import { ITxHistoryType } from '@features/Dashboard/types';

export interface ITxHistoryEntry
  extends Overwrite<ITxReceipt, { txType: ITxHistoryType; timestamp: number }> {
  network: Network;
  toAddressBookEntry?: ExtendedAddressBook;
  fromAddressBookEntry?: ExtendedAddressBook;
}

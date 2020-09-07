import { Overwrite } from 'utility-types';

import { ITxReceipt, ExtendedContact, NetworkId } from '@types';
import { ITxHistoryType } from '@features/Dashboard/types';

export interface ITxHistoryEntry
  extends Overwrite<ITxReceipt, { txType: ITxHistoryType; timestamp: number }> {
  networkId: NetworkId;
  toAddressBookEntry?: ExtendedContact;
  fromAddressBookEntry?: ExtendedContact;
}

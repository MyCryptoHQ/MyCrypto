import { Overwrite } from 'utility-types';

import { ITxHistoryType } from '@features/Dashboard/types';
import { ExtendedContact, ITxReceipt, NetworkId } from '@types';

export interface ITxHistoryEntry
  extends Overwrite<ITxReceipt, { txType: ITxHistoryType; timestamp: number }> {
  networkId: NetworkId;
  toAddressBookEntry?: ExtendedContact;
  fromAddressBookEntry?: ExtendedContact;
}

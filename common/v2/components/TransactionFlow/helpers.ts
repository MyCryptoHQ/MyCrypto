import { ValuesType } from 'utility-types';
import * as R from 'ramda';

import { ITxConfig, TAddress, StoreAccount } from 'v2/types';
import { getAccountBalance, getStoreAccount } from 'v2/services/Store';

import { ISender } from './types';

type FieldValue = ValuesType<ISender>;

const preferValueFromSender = (l: FieldValue, r: FieldValue): FieldValue => (R.isEmpty(r) ? l : r);

export const constructSenderFromTxConfig = (
  txConfig: ITxConfig,
  accounts: StoreAccount[]
): ISender => {
  const { network, senderAccount, from } = txConfig;
  const defaultSender: ISender = {
    address: from as TAddress,
    assets: [],
    network
  };

  const sender: ISender = R.mergeDeepWith(
    preferValueFromSender,
    defaultSender,
    R.pick(['address', 'assets', 'network'], {
      ...senderAccount
    })
  );

  // if account exists in store add it to sender
  const account = getStoreAccount(accounts)(sender.address, sender.network.id);
  if (account) {
    sender.account = account;
    sender.accountBalance = getAccountBalance(senderAccount);
  }

  return sender;
};

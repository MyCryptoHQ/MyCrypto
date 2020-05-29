import { ValuesType } from 'utility-types';
import isEmpty from 'ramda/src/isEmpty';
import pick from 'ramda/src/pick';
import mergeDeepWith from 'ramda/src/mergeDeepWith';

import { ITxConfig, StoreAccount } from '@types';
import { getAccountBalance, getStoreAccount } from '@services/Store';

import { ISender } from './types';

type FieldValue = ValuesType<ISender>;

const preferValueFromSender = (l: FieldValue, r: FieldValue): FieldValue => (isEmpty(r) ? l : r);

export const constructSenderFromTxConfig = (
  txConfig: ITxConfig,
  accounts: StoreAccount[]
): ISender => {
  const { network, senderAccount, from } = txConfig;
  const defaultSender: ISender = {
    address: from,
    assets: [],
    network
  };

  const sender: ISender = mergeDeepWith(
    preferValueFromSender,
    defaultSender,
    pick(['address', 'assets', 'network'], {
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

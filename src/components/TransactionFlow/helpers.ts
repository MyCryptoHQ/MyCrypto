import isEmpty from 'ramda/src/isEmpty';
import mergeDeepWith from 'ramda/src/mergeDeepWith';
import pick from 'ramda/src/pick';
import { ValuesType } from 'utility-types';

import { getAccountBalance, getStoreAccount } from '@services/Store';
import { ITxConfig, StoreAccount } from '@types';
import { bigNumGasPriceToViewableGwei } from '@utils';

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

// replacement gas price must be at least 10% higher than the replaced tx's gas price
export const calculateReplacementGasPrice = (txConfig: ITxConfig, fastGasPrice: number) =>
  Math.max(fastGasPrice, parseFloat(bigNumGasPriceToViewableGwei(txConfig.gasPrice)) * 1.101);

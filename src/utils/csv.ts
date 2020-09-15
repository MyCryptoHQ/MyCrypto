import BN from 'bn.js';
import { unparse } from 'papaparse';

import { DWAccountDisplay, fromTokenBase } from '@services';
import { Asset } from '@types';

export const accountsToCSV = (accounts: DWAccountDisplay[], asset: Asset) => {
  const infos = accounts.map((account) => ({
    address: account.address,
    'dpath type': account.pathItem.baseDPath.label,
    dpath: account.pathItem.path,
    asset:
      (account.balance
        ? parseFloat(
            fromTokenBase(new BN(account.balance.toString()), asset.decimal).toString()
          ).toFixed(4)
        : '0.0000') + asset.ticker
  }));

  return unparse(infos);
};

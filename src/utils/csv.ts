import { unparse } from 'papaparse';

import { DWAccountDisplay } from '@services';
import { Asset } from '@types';
import { bigify, fromTokenBase } from '@utils';
import { uniqBy } from '@vendor';

export const accountsToCSV = (accounts: DWAccountDisplay[], asset: Asset) => {
  const infos = uniqBy((a) => a.address, accounts).map((account) => ({
    address: account.address,
    'dpath type': account.pathItem.baseDPath.name,
    dpath: account.pathItem.path,
    asset:
      (account.balance
        ? bigify(fromTokenBase(bigify(account.balance), asset.decimal)).toFixed(4)
        : '0.0000') + asset.ticker
  }));

  return unparse(infos);
};

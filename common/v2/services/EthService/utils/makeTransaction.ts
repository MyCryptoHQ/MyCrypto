import Tx from 'ethereumjs-tx';

import { ITransaction, IHexStrTransaction } from 'v2/types';

export const makeTransaction = (
  t: Partial<Tx> | Partial<ITransaction> | Partial<IHexStrTransaction> | Buffer | string
) => new Tx(t);

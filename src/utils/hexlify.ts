import { BigifySupported } from '@types';

import { addHexPrefix } from './addHexPrefix';
import { bigify } from './bigify';

export const hexlify = (input: BigifySupported) => addHexPrefix(bigify(input).toString(16));

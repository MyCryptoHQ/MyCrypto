import { addHexPrefix } from './addHexPrefix';
import { bigify, BigifySupported } from './bigify';

export const hexlify = (input: BigifySupported) => addHexPrefix(bigify(input).toString(16));

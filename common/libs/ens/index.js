// @flow
import uts46 from 'idna-uts46';
import ethUtil from 'ethereumjs-util';
import ENS from './contracts';
import networkConfigs from './networkConfigs';
import type { TxCallObject } from 'libs/nodes/rpc/types';
import type { INode } from 'libs/nodes/INode';
const { main } = networkConfigs;

/**
0 - Name is available and the auction hasn’t started
1 - Name is available and the auction has been started
2 - Name is taken and currently owned by someone
3 - Name is forbidden
4 - Name is currently in the ‘reveal’ stage of the auction
5 - Name is not yet available due to the ‘soft launch’ of names.
 */
const modeMap = [
  'Name is available and the auction hasn’t started',
  'Name is available and the auction has been started',
  'Name is taken and currently owned by someone',
  'Name is forbidden',
  'Name is currently in the ‘reveal’ stage of the auction',
  'Name is not yet available due to the ‘soft launch’ of names.'
];

export function normalise(name: string) {
  try {
    return uts46.toUnicode(name, { useStd3ASCII: true, transitional: false });
  } catch (e) {
    throw e;
  }
}
export const nameHash = (name: string = ''): string => {
  if (name === '') {
    throw new Error('Empty string provided');
  }

  const normalizedName = normalise(name),
    sha3 = ethUtil.sha3,
    labels = normalizedName.split('.'),
    emptyNode = Buffer.alloc(32);
  const rawNode = labels.reduceRight((node, currentLabel) => {
    return sha3(Buffer.concat([node, sha3(currentLabel)]));
  }, emptyNode);

  return `0x${rawNode.toString('hex')}`;
};

export const resolveDomainTxObj = (_hash: string): TxCallObject => ({
  to: main.public.ethAuction,
  data: ENS.auction.entries.encodeInput({ _hash })
});

export const resolveDomainRequest = async (
  name: string,
  node: INode
): Promise<any> => {
  const _hash = ethUtil.sha3(name);
  const txObj = resolveDomainTxObj(_hash);
  const rawResult = await node.sendCallRequest(txObj);
  const parsedResult = ENS.auction.entries.decodeOutput(rawResult);
  return parsedResult;
};

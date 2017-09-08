import uts46 from 'idna-uts46';
import ethUtil from 'ethereumjs-util';
import ENS from './contract';
import networkConfigs from './networkConfigs';
import type { TxCallObject } from 'libs/node/rpc/types';
import type { INode } from 'libs/node/INode';
const { main } = networkConfigs;

export function normalise(name) {
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

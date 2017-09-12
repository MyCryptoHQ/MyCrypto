// @flow
import uts46 from 'idna-uts46';
import ethUtil from 'ethereumjs-util';
import ENS from './contracts';
import networkConfigs from './networkConfigs';
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
const modeMap = name => [
  `${name} is available and the auction hasn’t started`,
  `${name} is available and the auction has been started`,
  `${name} is taken and currently owned by someone`,
  `${name} is forbidden`,
  `${name} is currently in the ‘reveal’ stage of the auction`,
  `${name} is not yet available due to the ‘soft launch’ of names.`
];
ENS.auction.at(main.public.ethAuction);
ENS.registry.at(main.registry);

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
const setNodes = node => {
  ENS.auction.setNode(node);
  ENS.deed.setNode(node);
  ENS.resolver.setNode(node);
  ENS.registry.setNode(node);
};
export const resolveDomainRequest = async (
  name: string,
  node: INode
): Promise<any> => {
  setNodes(node);
  const _hash = ethUtil.sha3(name);
  const _nameHash = nameHash(`${name}.eth`);

  const domainData = await ENS.auction.entries.call({ _hash });
  const { ownerAddress } = await ENS.deed
    .at(domainData.deedAddress)
    .owner.call();
  const { resolverAddress } = await ENS.registry.resolver.call({
    node: _nameHash
  });

  let resolvedAddress = '0x0';

  if (resolverAddress !== '0x0') {
    const { ret } = await ENS.resolver
      .at(resolverAddress)
      .addr.call({ node: _hash });
    resolvedAddress = ret;
  }

  return {
    ...domainData,
    labelHash: _hash.toString('hex'),
    nameHash: _nameHash,
    mappedMode: modeMap(`${name}.eth`)[domainData.mode],
    ownerAddress,
    resolvedAddress
  };
};

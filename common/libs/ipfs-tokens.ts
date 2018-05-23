import { IPFS_GATEWAY, IPFS_MULTISIG_CONTRACT_ADDRESS } from 'config';
import { Token, StaticNetworkConfig } from 'shared/types/network';
import Contract from 'libs/contracts';
import { ABIFunc } from './erc20';
import { shepherdProvider } from './nodes';
import bs58 from 'bs58';
import { handleValues } from './units';
const { processTokenJson } = require('../../shared/update-tokens-utils');

function makeIpfsGatewayUrl(ipfsHash: string) {
  return `${IPFS_GATEWAY}/ipfs/${ipfsHash}`;
}

function getTokenList(ipfsHash: string): Promise<Token[]> {
  return fetch(makeIpfsGatewayUrl(ipfsHash))
    .then(r => r.json())
    .then(processTokenJson);
}

type uint256 = any;
type bytes32 = any;
type uint8 = any;

interface GetEntryResponse {
  digest: bytes32;
  hashfunction: uint8;
  size: uint8;
}

/**
 * Encode a multihash structure into base58 encoded multihash string
 *
 * @param {Multihash} multihash
 * @returns {(string|null)} base58 encoded multihash string
 */
function getMultihashFromBytes32(multihash: GetEntryResponse) {
  const { digest, hashfunction, size } = multihash;
  if (size === 0) {
    return null;
  }

  // prepend hashFunction and digest size
  const multihashBytes = Buffer.alloc(2 + digest.length);
  multihashBytes[0] = hashfunction;
  multihashBytes[1] = size;
  multihashBytes.set(digest, 2);

  return bs58.encode(multihashBytes);
}

function fetchLatestIpfsHash(key: number) {
  interface IContract {
    getEntry: ABIFunc<{ _key: uint256 }, GetEntryResponse>;
  }

  const abi = [
    {
      name: 'getEntry',
      type: 'function',
      constant: true,
      payable: false,
      stateMutability: 'view',
      inputs: [
        {
          name: '_key',
          type: 'uint256'
        }
      ],
      outputs: [
        {
          name: 'digest',
          type: 'bytes32'
        },
        {
          name: 'hashfunction',
          type: 'uint8'
        },
        {
          name: 'size',
          type: 'uint8'
        }
      ]
    }
  ];

  const contract = (new Contract(abi) as any) as IContract;

  return shepherdProvider
    .sendCallRequest({
      data: contract.getEntry.encodeInput({ _key: key }),
      to: IPFS_MULTISIG_CONTRACT_ADDRESS
    })
    .then(contract.getEntry.decodeOutput)
    .then(({ digest, hashfunction, size }) => ({
      digest,
      hashfunction: handleValues(hashfunction).toNumber(),
      size: handleValues(size).toNumber()
    }))
    .then(getMultihashFromBytes32);
}

export async function updateTokensForNetwork(network: StaticNetworkConfig) {
  const { tokens: currTokenList, chainId: key, tokenListHash } = network;
  if (!network.shouldCheckForTokenUpdates) {
    return { tokens: currTokenList, hash: null };
  }
  const latestHash = await fetchLatestIpfsHash(key);

  if (!latestHash) {
    return { tokens: currTokenList, hash: null };
  }

  if (tokenListHash === latestHash) {
    return { tokens: currTokenList, hash: null };
  }

  const latestList = await getTokenList(latestHash);

  return { tokens: latestList, hash: latestHash };
}

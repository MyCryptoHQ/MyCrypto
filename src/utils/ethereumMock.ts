import { ethers, Wallet } from 'ethers';

import { NODES_CONFIG } from '@database/data';
import { NetworkId } from '@types';

import { noOp } from './noOp';

export const ethereumMock = () => {
  let wallet: Wallet;
  let chainId: number;

  enum Networks {
    Ethereum = 1,
    Ropsten = 3,
    Rinkeby = 4,
    Kovan = 42,
    Goerli = 5
  }

  // CONFIG
  const initialize = (privKey: string, _chainId: number) => {
    chainId = _chainId;
    const networkName = Object.entries(Networks).find(([_, id]) => id == chainId)![0];
    const nodes = NODES_CONFIG[networkName as NetworkId];
    const node = nodes[0];
    const provider = new ethers.providers.JsonRpcProvider(node, chainId);
    wallet = new Wallet(privKey, provider);
  };

  // MOCKS
  const wrapResult = ({ id, result }: { id: number; result: any }) => ({
    id,
    result,
    jsonrpc: '2.0'
  });

  const enable = () => Promise.resolve([wallet.address]);

  // DONT SUPPORT EVENTS
  const on = noOp;
  const removeAllListeners = noOp;

  const getResult = async (method: string, params: any) => {
    switch (method) {
      case 'eth_accounts':
        return [wallet.address];
      case 'net_version':
        return chainId;
      case 'eth_sendTransaction': {
        const { gas, from, ...rest } = params[0];
        const result = await wallet.sendTransaction({
          ...rest,
          chainId
        });
        return result.hash;
      }
    }
    return null;
  };

  const sendAsync = (
    { method, params, id }: { method: string; params: any; id: number },
    callback: (error: any, result: any) => void
  ) => {
    getResult(method, params).then((result) => callback(null, wrapResult({ id, result })));
  };

  return { initialize, enable, sendAsync, on, removeAllListeners };
};

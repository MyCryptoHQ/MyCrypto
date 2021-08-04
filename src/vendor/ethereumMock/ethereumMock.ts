import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';

export const ethereumMock = () => {
  let wallet: Wallet;
  let provider: JsonRpcProvider;
  let chainId: number;

  // CONFIG
  const initialize = (privKey: string, _chainId: number, jsonRpcUrl: string) => {
    chainId = _chainId;
    provider = new JsonRpcProvider(jsonRpcUrl, chainId);
    wallet = new Wallet(privKey, provider);
  };

  // UTILS
  const wrapResult = ({ id, result }: { id: number; result: any }) => ({
    id,
    result,
    jsonrpc: '2.0'
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const noOp = () => {};

  // MOCKS
  const enable = () => Promise.resolve([wallet.address]);

  // DONT SUPPORT EVENTS
  const on = noOp;
  const removeAllListeners = noOp;

  const getResult = async (method: string, params: any) => {
    switch (method) {
      case 'eth_accounts':
        return [wallet.address];
      case 'wallet_getPermissions':
      case 'wallet_requestPermissions':
        // Don't support for now
        return undefined;
      case 'net_version':
        return chainId.toString();
      case 'eth_sendTransaction': {
        const { gas, from, type, ...rest } = params[0];
        const result = await wallet.sendTransaction({
          ...rest,
          type: type !== undefined ? parseInt(type, 16) : undefined,
          chainId
        });
        return result.hash;
      }
      default:
        // Default to sending to JSON RPC
        return await provider.send(method, params);
    }
  };

  const sendAsync = (
    { method, params, id }: { method: string; params: any; id: number },
    callback: (error: any, result: any) => void
  ) => {
    if (!provider || !wallet) {
      callback('Mock not initialized', null);
    } else {
      getResult(method, params).then((result) => callback(null, wrapResult({ id, result })));
    }
  };

  return { initialize, enable, sendAsync, on, removeAllListeners };
};

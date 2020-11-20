import { ethers, Wallet } from 'ethers';

export const ethereumMock = () => {
  let wallet: Wallet;
  let chainId: number;

  // CONFIG
  const initialize = (privKey: string, _chainId: number, jsonRpcUrl: string) => {
    chainId = _chainId;
    const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl, chainId);
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
    console.log(method, params);
    switch (method) {
      case 'eth_accounts':
        return [wallet.address];
      case 'net_version':
        return chainId.toString();
      case 'eth_sendTransaction': {
        const { gas, from, ...rest } = params[0];
        const result = await wallet.sendTransaction({
          ...rest,
          chainId
        });
        return result.hash;
      }
      case 'eth_getTransactionCount': {
        return '0x0';
      }
      default:
        return undefined;
    }
  };

  const sendAsync = (
    { method, params, id }: { method: string; params: any; id: number },
    callback: (error: any, result: any) => void
  ) => {
    getResult(method, params).then((result) => callback(null, wrapResult({ id, result })));
  };

  return { initialize, enable, sendAsync, on, removeAllListeners };
};

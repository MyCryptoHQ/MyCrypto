import { shepherd } from 'myc-shepherd';
import { INode } from '.';

export interface IProviderConfig {
  concurrency: number;
  requestFailureThreshold: number;
  timeoutThresholdMs: number;
  supportedMethods: { [rpcMethod in keyof INode]: boolean };
  network: string;
}

type DeepPartial<T> = Partial<{ [key in keyof T]: Partial<T[key]> }>;

export const makeProviderConfig = (options: DeepPartial<IProviderConfig> = {}): IProviderConfig => {
  const defaultConfig: IProviderConfig = {
    concurrency: 6,
    network: 'ETH',
    requestFailureThreshold: 3,
    supportedMethods: {
      ping: true,
      sendCallRequest: true,
      getBalance: true,
      estimateGas: true,
      getTransactionCount: true,
      getCurrentBlock: true,
      sendRawTx: true,
      getTokenBalance: true,
      getTokenBalances: true,
      getTransactionByHash: true,
      getTransactionReceipt: true
    },
    timeoutThresholdMs: 3000
  };

  return {
    ...defaultConfig,
    ...options,
    supportedMethods: {
      ...defaultConfig.supportedMethods,
      ...(options.supportedMethods ? options.supportedMethods : {})
    }
  };
};
const regEthConf = makeProviderConfig();
const web3EthConfs = {
  nonWeb3: makeProviderConfig({ supportedMethods: { sendRawTx: false } }),
  web3: makeProviderConfig({ supportedMethods: { sendRawTx: true } })
};
const eth_mycrypto = ['rpc', 'eth_mycrypto', regEthConf, 'https://api.mycryptoapi.com/eth'];
const eth_ethscan = ['etherscan', 'eth_ethscan', regEthConf, 'https://api.etherscan.io/api'];
const eth_infura = ['infura', 'eth_infura', regEthConf, 'https://mainnet.infura.io/mycrypto'];
const eth_blockscale = [
  'rpc',
  'eth_blockscale',
  regEthConf,
  'https://api.dev.blockscale.net/dev/parity'
];
let shepherdProvider: INode;

shepherd.init().then(provider => (shepherdProvider = provider));

export { shepherdProvider };

shepherd.useProvider(...eth_mycrypto);
shepherd.useProvider(...eth_ethscan);
shepherd.useProvider(...eth_infura);
shepherd.useProvider(...eth_blockscale);

export * from './INode';

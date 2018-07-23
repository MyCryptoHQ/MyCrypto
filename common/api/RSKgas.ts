import { GasEstimates } from './gas';
import { checkHttpStatus, parseJSON } from './utils';

export function fetchRSKEstimates(chainId: number): Promise<GasEstimates> {
  const url: string =
    chainId === 30 ? 'https://mycrypto.rsk.co' : 'https://mycrypto.testnet.rsk.co';
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: ['latest', false],
      id: 1
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(res => {
      const minGasPriceWei: number = +res.result.minimumGasPrice / 1000000000;
      let minGasPrice: number;
      let min: number;
      if (chainId === 31 && minGasPriceWei === 0) {
        minGasPrice = 1;
        min = 1;
      } else {
        minGasPrice = minGasPriceWei;
        min = minGasPrice * 1.0001;
      }

      return {
        chainId,
        safeLow: min,
        standard: min,
        fast: min,
        fastest: minGasPrice * 10,
        isDefault: false,
        time: Date.now()
      } as GasEstimates;
    });
}

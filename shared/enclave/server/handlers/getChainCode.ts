import { getWalletLib } from 'shared/enclave/server/wallets';
import { GetChainCodeParams, GetChainCodeResponse } from 'shared/enclave/types';

export function getChainCode(params: GetChainCodeParams): Promise<GetChainCodeResponse> {
  const wallet = getWalletLib(params.walletType);
  return wallet.getChainCode(params.dpath);
}

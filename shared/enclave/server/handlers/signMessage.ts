import { getWalletLib } from 'shared/enclave/server/wallets';
import { SignMessageParams, SignMessageResponse } from 'shared/enclave/types';

export function signMessage(params: SignMessageParams): Promise<SignMessageResponse> {
  const wallet = getWalletLib(params.walletType);
  return wallet.signMessage(params.message, params.path);
}

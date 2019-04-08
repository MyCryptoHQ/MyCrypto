import { IWallet, getPrivKeyWallet, IFullWallet } from "libs/wallet";
import { translateRaw } from "translations";
import { PrivateKeyUnlockParams } from "./types";


export const unlockPrivateKey = async (payload: PrivateKeyUnlockParams): Promise<IFullWallet | undefined> => {
  let wallet: IWallet | null = null;
  const { key, password } = payload;

  try {
    wallet = getPrivKeyWallet(key, password);
  } catch (e) {
    console.log('Error: ' + translateRaw('INVALID_PKEY'));
    return;
  }
  return(wallet);
}
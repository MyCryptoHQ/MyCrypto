import { Web3Wallet } from "v2/libs/wallet";

export type TUnlockWeb3 = () => Promise<Web3Wallet | undefined>;
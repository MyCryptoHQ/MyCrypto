import { Web3Wallet } from '../non-deterministic';

export type TUnlockWalletConnect = () => Promise<Web3Wallet | undefined>;

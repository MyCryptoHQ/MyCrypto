import { Web3Wallet } from '../non-deterministic';

export type TUnlockWeb3 = () => Promise<Web3Wallet | undefined>;

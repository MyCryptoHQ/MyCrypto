import { Web3Wallet } from 'v2/services/EthService';

export type TUnlockWeb3 = () => Promise<Web3Wallet | undefined>;

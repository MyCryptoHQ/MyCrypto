// All keys should be optional and nullable, since WalletConfig is not set the
// first time it's unlocked, and any configuration should be removable.
export interface WalletConfig {
  tokens?: string[] | null;
}

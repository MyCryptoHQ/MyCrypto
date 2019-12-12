import WalletConnect from '@walletconnect/browser';

export const walletConnectBridgeURI = 'https://bridge.walletconnect.org';

// Singleton that handles the WalletConnect session singleton
export class WalletConnectSingleton {
  public static async getWalletConnectSession(): Promise<WalletConnect> {
    // If there is no current active bridge, create one
    if (!this.instance.bridge) {
      this.instance = new WalletConnect({
        bridge: walletConnectBridgeURI
      });
    }
    // If there is no current active session, create one
    if (this.instance.key === '' && this.instance.bridge) {
      await this.instance.createSession();
      return this.instance;
    }
    return this.instance;
  }

  // This method allows us to do back-to-back AddAccount flow walkthroughs.
  // This is meant to simulate how other wallets work.
  public static async refreshWalletConnectSession(): Promise<WalletConnect> {
    // If a session exists, kill it
    if (this.instance.session) {
      this.instance.killSession();
    }
    // Start a new session
    this.instance = new WalletConnect({
      bridge: walletConnectBridgeURI
    });
    await this.instance.createSession();
    return this.instance;
  }

  private static instance: WalletConnect = {} as WalletConnect;

  private constructor() {}
}

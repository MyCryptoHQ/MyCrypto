import { default as WalletConnectInstance } from '@walletconnect/browser';

export const walletConnectBridgeURI = 'https://bridge.walletconnect.org';

// Singleton that handles the WalletConnect session
export class WalletConnectSingleton {
  public static async getWalletConnectSession(): Promise<WalletConnectInstance> {
    // If there is no current active bridge, create one
    if (!this.instance.bridge) {
      this.instance = new WalletConnectInstance({
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
  // This is meant to simulate how other wallets work, allowing us to refresh the WalletConnectSession
  public static async refreshWalletConnectSession(): Promise<WalletConnectInstance> {
    // If a session exists, kill it
    if (window.localStorage.getItem('walletconnect') || this.instance.session) {
      await this.instance.killSession();
    }
    // Start a new session
    this.instance = new WalletConnectInstance({
      bridge: walletConnectBridgeURI
    });
    await this.instance.createSession();
    return this.instance;
  }

  private static instance: WalletConnectInstance = {} as WalletConnectInstance;

  private constructor() {}
}

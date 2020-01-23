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
    }
    return this.instance;
  }

  public static initializeWalletConnectSession(session: any): WalletConnectInstance {
    console.debug('[InitWalletConnectSession]: Session initialization requested');
    const options = session || { bridge: walletConnectBridgeURI };
    console.debug('[InitWalletConnectSession]: Session initialize with options: ', options);
    this.instance = new WalletConnectInstance(options);
    console.debug('[InitWalletConnectSession]: Session: ', this.instance);
    return this.instance;
  }

  // This method allows us to do back-to-back AddAccount flow walkthroughs.
  // This is meant to simulate how other wallets work, allowing us to refresh the WalletConnectSession
  public static async refreshWalletConnectSession(): Promise<WalletConnectInstance> {
    // If a session exists, kill it
    console.debug('[RefreshWalletConnect]: Session refresh requested');
    if (window.localStorage.getItem('walletconnect') || this.instance.session) {
      console.debug('[RefreshWalletConnect]: Killing session now');
      await this.instance.killSession();
    }
    console.debug('[RefreshWalletConnect]: Initializing new session');
    // Start a new session
    this.instance = new WalletConnectInstance({
      bridge: walletConnectBridgeURI
    });
    console.debug('[RefreshWalletConnect]: Creating session');
    await this.instance.createSession();
    console.debug('[RefreshWalletConnect]: Returning session');
    return this.instance;
  }

  private static instance: WalletConnectInstance = {} as WalletConnectInstance;

  private constructor() {}
}

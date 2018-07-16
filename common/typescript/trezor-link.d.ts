declare module 'trezor-link' {
  export interface TrezorDeviceInfo {
    path: string;
  }

  export interface TrezorDeviceInfoWithSession extends TrezorDeviceInfo {
    session?: string;
  }

  export interface AcquireInput {
    path: string;
    previous?: string;
    checkPrevious: boolean;
  }

  export interface MessageFromTrezor {
    type: string;
    message: any;
  }

  export interface Transport {
    configured: boolean;
    version: string;
    name: string;
    requestNeeded: boolean;
    isOutdated: boolean;

    enumerate(): Promise<TrezorDeviceInfoWithSession[]>;
    listen(old?: TrezorDeviceInfoWithSession[]): Promise<TrezorDeviceInfoWithSession[]>;
    acquire(input: AcquireInput): Promise<string>;
    release(session: string, onclose: boolean): Promise<void>;
    configure(signedData: string): Promise<void>;
    call(session: string, name: string, data: any): Promise<MessageFromTrezor>;
    init(debug?: boolean): Promise<void>;
    stop(): void;
    requestDevice(): Promise<void>;
    setBridgeLatestUrl(url: string): void;
  }
}

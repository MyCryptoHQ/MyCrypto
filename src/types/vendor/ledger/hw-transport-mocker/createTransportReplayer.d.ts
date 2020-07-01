declare module '@ledgerhq/hw-transport-mocker/createTransportReplayer' {
  import Transport, { Observer, Subscription } from '@ledgerhq/hw-transport';
  import { RecordStore } from '@ledgerhq/hw-transport-mocker/RecordStore';

  class TransportReplayer<T> extends Transport<T> {
    public static isSupported(): Promise<true>;

    public static list(): Promise<[null]>;

    public static listen(observer: Observer<{ type: 'add'; descriptor: null }>): Subscription;

    public static open(): Promise<TransportReplayer<any>>;
  }

  type TransportConstructor<T> = new (...args: any[]) => Transport<T>;

  type TransportReplayerConstructor<T> = typeof TransportReplayer &
    (new (...args: any[]) => TransportReplayer<T>);

  /**
   * Create a transport, which replays any APDU exchanges.
   *
   * @param {RecordStore} recordStore The RecordStore to replay from.
   * @return {TransportReplayer<T>} The decorated transport.
   */
  export default function <T>(recordStore: RecordStore): TransportReplayerConstructor<T>;
}

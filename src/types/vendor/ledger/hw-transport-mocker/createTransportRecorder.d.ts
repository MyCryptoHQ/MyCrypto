declare module '@ledgerhq/hw-transport-mocker/createTransportRecorder' {
  import Transport from '@ledgerhq/hw-transport';
  import { RecordStore } from '@ledgerhq/hw-transport-mocker/RecordStore';

  class TransportRecorder<T> extends Transport<T> {
    public static recordStore: RecordStore;

    public static isSupported: typeof Transport.isSupported;

    public static list: typeof Transport.list;
  }

  type TransportConstructor<T> = new (...args: any[]) => Transport<T>;

  type TransportRecorderConstructor<T> = typeof TransportRecorder &
    (new (...args: any[]) => TransportRecorder<T>);

  /**
   * Create a decorated transport, which records any APDU exchanges.
   *
   * @param {TransportConstructor<T>} DecoratedTransport The transport class to decorate.
   * @param {RecordStore} recordStore The RecordStore to record to.
   * @return {TransportRecorder<T>} The decorated transport.
   */
  export default function <T>(
    DecoratedTransport: TransportConstructor<T>,
    recordStore: RecordStore
  ): TransportRecorderConstructor<T>;
}

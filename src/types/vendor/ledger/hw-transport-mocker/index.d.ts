/**
 * Note: This stuff isn't documented at all, so these declarations may be inaccurate.
 */
declare module '@ledgerhq/hw-transport-mocker' {
  export { default as createTransportRecorder } from '@ledgerhq/hw-transport-mocker/createTransportRecorder';
  export { default as createTransportReplayer } from '@ledgerhq/hw-transport-mocker/createTransportReplayer';
  export * from '@ledgerhq/hw-transport-mocker/RecordStore';
}

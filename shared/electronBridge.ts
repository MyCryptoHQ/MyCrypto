// Provide typescript definitions / mappings between `electron-app/preload.ts`
// and 'common/utils/electron.ts'
export type ElectronBridgeCallback = (data?: any) => void;

export interface ElectronBridgeFunctions {
  addListener(event: string, cb: ElectronBridgeCallback);
  sendEvent(event: string, data?: any);
  openInBrowser(url: string): boolean;
}

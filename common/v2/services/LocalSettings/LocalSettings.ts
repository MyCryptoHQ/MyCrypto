import * as utils from 'v2/libs';
import { initializeCache, LocalCache } from 'v2/services/LocalCache';
import { LocalSetting, ExtendedLocalSetting } from './types';

export default class LocalSettingsServiceBase {
  // TODO: Add duplication/validation handling.

  public init = () => {
    initializeCache();
  };

  public createLocalSetting = (LocalSettings: LocalSetting) => {
    this.init();
    // Handle LocalSetting
    const uuid = utils.generateUUID();

    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newLocalSettingCache = parsedLocalCache;
    newLocalSettingCache.localSettings[uuid] = LocalSettings;

    newLocalSettingCache.allLocalSettings = [...newLocalSettingCache.allLocalSettings, uuid];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newLocalSettingCache));
  };

  public readLocalSetting = (uuid: string) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    return parsedLocalCache.localSettings[uuid];
  };

  public updateLocalSetting = (uuid: string, LocalSettings: LocalSetting) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newLocalSettingCache = Object.assign(
      {},
      parsedLocalCache.localSettings[uuid],
      LocalSettings
    );

    localStorage.setItem('MyCryptoCache', JSON.stringify(newLocalSettingCache));
  };

  public deleteLocalSetting = (uuid: string) => {
    this.init();
    // Handle LocalSetting
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    delete parsedLocalCache.localSettings[uuid];
    const newallLocalSettings = parsedLocalCache.allLocalSettings.filter(
      (obj: string) => obj !== uuid
    );
    parsedLocalCache.allLocalSettings = newallLocalSettings;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readLocalSettings = (): ExtendedLocalSetting[] => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    let out: ExtendedLocalSetting[] = [];
    if (parsedLocalCache.allLocalSettings && parsedLocalCache.allLocalSettings.length >= 1) {
      parsedLocalCache.allLocalSettings.map((uuid: string) => {
        out.push({ ...parsedLocalCache.localSettings[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  };
}

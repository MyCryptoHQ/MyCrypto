import * as utils from 'v2/libs';
import { initializeCache } from 'v2/services/LocalCache';
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

    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch (e) {
      parsedLocalCache = localCache;
    }
    const newLocalSettingCache = parsedLocalCache;
    newLocalSettingCache.LocalSetting[uuid] = LocalSettings;

    newLocalSettingCache.LocalSettingList = [...newLocalSettingCache.LocalSettingList, uuid];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newLocalSettingCache));
  };

  public readLocalSetting = (uuid: string) => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch {
      parsedLocalCache = localCache;
    }
    return parsedLocalCache.LocalSetting[uuid];
  };

  public updateLocalSetting = (uuid: string, LocalSettings: LocalSetting) => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch {
      parsedLocalCache = localCache;
    }
    const newLocalSettingCache = Object.assign(
      {},
      parsedLocalCache.LocalSetting[uuid],
      LocalSettings
    );

    localStorage.setItem('MyCryptoCache', JSON.stringify(newLocalSettingCache));
  };

  public deleteLocalSetting = (uuid: string) => {
    this.init();
    // Handle LocalSetting
    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch {
      parsedLocalCache = localCache;
    }
    delete parsedLocalCache.LocalSetting[uuid];
    const newLocalSettingList = parsedLocalCache.LocalSettingList.filter(
      (obj: string) => obj !== uuid
    );
    parsedLocalCache.LocalSettingList = newLocalSettingList;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readLocalSettings = (): ExtendedLocalSetting[] => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '[]';
    let parsedLocalCache: any;
    let out: ExtendedLocalSetting[] = [];
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch (e) {
      parsedLocalCache = localCache;
    }
    if (parsedLocalCache.LocalSettingList && parsedLocalCache.LocalSettingList.length >= 1) {
      parsedLocalCache.LocalSettingList.map((uuid: string) => {
        out.push({ ...parsedLocalCache.LocalSetting[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  };
}

import * as utils from 'v2/libs';
import { initializeCache, LocalCache } from 'v2/services/LocalCache';
import { ActiveNotifications, ExtendedActiveNotifications } from './types';

export default class ActiveNotificationsServiceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public createActiveNotifications = (activeNotifications: ActiveNotifications) => {
    this.init();
    // Handle ActiveNotifications
    const uuid = utils.generateUUID();

    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newActiveNotificationsCache = parsedLocalCache;
    newActiveNotificationsCache.activeNotifications[uuid] = activeNotifications;

    newActiveNotificationsCache.allActiveNotifications = [
      ...newActiveNotificationsCache.allActiveNotifications,
      uuid
    ];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newActiveNotificationsCache));
  };

  public readActiveNotifications = (uuid: string) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    return parsedLocalCache.activeNotifications[uuid];
  };

  public updateActiveNotifications = (uuid: string, activeNotifications: ActiveNotifications) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newActiveNotificationsCache = Object.assign(
      {},
      parsedLocalCache.activeNotifications[uuid],
      activeNotifications
    );

    localStorage.setItem('MyCryptoCache', JSON.stringify(newActiveNotificationsCache));
  };

  public deleteActiveNotifications = (uuid: string) => {
    this.init();
    // Handle ActiveNotifications
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    delete parsedLocalCache.activeNotifications[uuid];
    const newallActiveNotifications = parsedLocalCache.allActiveNotifications.filter(
      (obj: string) => obj !== uuid
    );
    parsedLocalCache.allActiveNotifications = newallActiveNotifications;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readAllActiveNotifications = (): ExtendedActiveNotifications[] => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '[]');
    let out: ExtendedActiveNotifications[] = [];
    if (
      parsedLocalCache.allActiveNotifications &&
      parsedLocalCache.allActiveNotifications.length >= 1
    ) {
      parsedLocalCache.allActiveNotifications.map((uuid: string) => {
        out.push({ ...parsedLocalCache.activeNotifications[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  };
}

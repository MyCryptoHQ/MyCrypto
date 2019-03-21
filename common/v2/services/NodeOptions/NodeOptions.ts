import * as utils from 'v2/libs';
import { initializeCache, LocalCache } from 'v2/services/LocalCache';
import { NodeOptions, ExtendedNodeOptions } from './types';

export default class NodeOptionsServiceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public createNodeOptions = (nodeOptions: NodeOptions) => {
    this.init();
    // Handle NodeOptions
    const uuid = utils.generateUUID();

    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newNodeOptionsCache = parsedLocalCache;
    newNodeOptionsCache.nodeOptions[uuid] = nodeOptions;

    newNodeOptionsCache.allNodeOptions = [...newNodeOptionsCache.allNodeOptions, uuid];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newNodeOptionsCache));
  };

  public readNodeOptions = (uuid: string) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    return parsedLocalCache.nodeOptions[uuid];
  };

  public updateNodeOptions = (uuid: string, nodeOptions: NodeOptions) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newNodeOptionsCache = Object.assign({}, parsedLocalCache.nodeOptions[uuid], nodeOptions);

    localStorage.setItem('MyCryptoCache', JSON.stringify(newNodeOptionsCache));
  };

  public deleteNodeOptions = (uuid: string) => {
    this.init();
    // Handle NodeOptions
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    delete parsedLocalCache.nodeOptions[uuid];
    const newallNodeOptions = parsedLocalCache.allNodeOptions.filter((obj: string) => obj !== uuid);
    parsedLocalCache.allNodeOptions = newallNodeOptions;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readAllNodeOptions = (): ExtendedNodeOptions[] => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '[]');
    let out: ExtendedNodeOptions[] = [];
    if (parsedLocalCache.allNodeOptions && parsedLocalCache.allNodeOptions.length >= 1) {
      parsedLocalCache.allNodeOptions.map((uuid: string) => {
        out.push({ ...parsedLocalCache.nodeOptions[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  };
}

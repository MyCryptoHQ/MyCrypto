export interface Cache {
  [identifier: string]: {
    [entry: string]: {
      value: any;
      ttl: number;
    };
  };
}

export interface NewCacheEntry {
  [key: string]: any;
}

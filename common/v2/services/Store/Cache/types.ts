export interface DataCache {
  [identifier: string]: {
    [entry: string]: any;
  };
}

export interface DataEntry {
  [key: string]: any;
}

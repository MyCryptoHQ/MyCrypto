import { FlowTransducer, GenObject } from './types';

export const toArray = (object: any): any[] => Object.values(object);

export const toObject = <T extends TObject>(keyInElem: keyof T) => (
  acc: GenObject<T>,
  elem: T
): GenObject<T> => ({
  ...acc,
  [elem[keyInElem] as any]: elem
});

export const add: FlowTransducer = (key) => (fn) => (data) => (store) => {
  return {
    ...store,
    [key]: fn(data, store)
  };
};

import { schema } from 'normalizr';

export const allIds = (byIds: { [name: string]: {} }) => {
  return Object.keys(byIds);
};

export const option = new schema.Entity('options');
export const providerRate = new schema.Entity('providerRates', {
  options: [option]
});

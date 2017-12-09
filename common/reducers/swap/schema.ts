import { schema } from 'normalizr';

export const allIds = (byIds: { [name: string]: {} }) => {
  console.log('byid', byIds);
  return Object.keys(byIds);
};
export const option = new schema.Entity('options');
export const bityRate = new schema.Entity('bityRates', {
  options: [option]
});

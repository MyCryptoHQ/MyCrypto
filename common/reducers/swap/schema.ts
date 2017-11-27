import { schema } from 'normalizr';

const option = new schema.Entity('options');
export const bityRate = new schema.Entity('bityRates', {
  options: [option]
});

import { SCHEMA_BASE } from './schema';
import { createSchema } from './migration';

export { addDevSeedToSchema } from './devSeed';
export { removeSeedDataFromSchema } from './removeSeed';
export const SCHEMA_DEFAULT = createSchema(SCHEMA_BASE);

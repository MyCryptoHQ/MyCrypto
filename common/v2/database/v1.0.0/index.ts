import { SCHEMA_BASE } from './schema';
import { createDefaultValues } from './generateDefaultValues';

export { addDevSeedToSchema } from './devSeed';
export { removeSeedDataFromSchema } from './removeSeed';
export { migrate } from './migration';
export const SCHEMA_DEFAULT = createDefaultValues(SCHEMA_BASE);

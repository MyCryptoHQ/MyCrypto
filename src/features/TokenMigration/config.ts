import { MigrationType } from '@types';

import { repTokenMigrationConfig } from './RepTokenMigration/config';

export const MIGRATION_CONFIGS = {
  [MigrationType.REP]: repTokenMigrationConfig,
  [MigrationType.ANT]: null,
  [MigrationType.GOLEM]: null
};

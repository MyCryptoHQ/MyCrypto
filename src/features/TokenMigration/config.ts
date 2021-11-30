import { MigrationType } from '@types';

import { migrationConfig } from './AaveTokenMigration';
import { tokenMigrationConfig } from './AntTokenMigration';
import { golemTokenMigrationConfig } from './GolemTokenMigration';
import { repTokenMigrationConfig } from './RepTokenMigration';

export const MIGRATION_CONFIGS = {
  [MigrationType.REP]: repTokenMigrationConfig,
  [MigrationType.ANT]: tokenMigrationConfig,
  [MigrationType.GOLEM]: golemTokenMigrationConfig,
  [MigrationType.AAVE]: migrationConfig
};

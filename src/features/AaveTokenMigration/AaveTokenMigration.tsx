import React from 'react';

import { TokenMigrationStepper } from '@components';

import { migrationConfig } from './config';

export const AaveTokenMigration = () => {
  return <TokenMigrationStepper tokenMigrationConfig={migrationConfig} />;
};

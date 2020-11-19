import React from 'react';

import { TokenMigrationStepper } from '@components';

import { golemTokenMigrationConfig } from './config';

const GolemTokenMigration = () => {
  return <TokenMigrationStepper tokenMigrationConfig={golemTokenMigrationConfig} />;
};

export default GolemTokenMigration;

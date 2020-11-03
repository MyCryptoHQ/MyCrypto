import React from 'react';

import { TokenMigrationStepper } from '@components';

import { tokenMigrationConfig } from './config';

const AntTokenMigration = () => {
  return <TokenMigrationStepper tokenMigrationConfig={tokenMigrationConfig} />;
};

export default AntTokenMigration;

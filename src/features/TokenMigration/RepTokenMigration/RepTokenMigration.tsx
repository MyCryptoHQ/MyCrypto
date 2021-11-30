import { TokenMigrationStepper } from '@components';

import { repTokenMigrationConfig } from './config';

const RepTokenMigration = () => {
  return <TokenMigrationStepper tokenMigrationConfig={repTokenMigrationConfig} />;
};

export default RepTokenMigration;

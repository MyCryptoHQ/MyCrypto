import { ABIFunc } from './abiFunc';

export interface IAaveMigrator {
  migrateFromLEND: ABIFunc<TObject>;
}

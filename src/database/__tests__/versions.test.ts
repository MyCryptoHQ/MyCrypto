import moment from 'moment';

import { getExportFileName } from '@database';
import { SETTINGS_FILENAME } from '@config';

describe('getExportFileName', () => {
  const dbConfig = {
    version: 'v1.0.0',
    main: 'MYC_Storage',
    vault: 'MYC_Vault',
    schema: {}
  };

  const now = moment();

  it('is json file', async () => {
    const fileName = getExportFileName(dbConfig, now);
    expect(fileName).toContain('.json');
  });

  it('contains correct version number', async () => {
    const fileName = getExportFileName(dbConfig, now);
    expect(fileName).toContain(dbConfig.version);
  });

  it('contains correct date', async () => {
    const fileName = getExportFileName(dbConfig, now);
    expect(fileName).toContain(now.format('YYYY-MM-DD'));
  });

  it('contains correct name', async () => {
    const fileName = getExportFileName(dbConfig, now);
    expect(fileName).toContain(SETTINGS_FILENAME);
  });
});

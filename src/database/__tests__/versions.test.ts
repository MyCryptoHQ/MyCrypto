import { SETTINGS_FILENAME } from '@config';
import { getCurrentDBConfig, getExportFileName } from '@database';
import { formatDate } from '@utils';

describe('getExportFileName', () => {
  const dbConfig = getCurrentDBConfig();

  const now = new Date();

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
    expect(fileName).toContain(formatDate(now));
  });

  it('contains correct name', async () => {
    const fileName = getExportFileName(dbConfig, now);
    expect(fileName).toContain(SETTINGS_FILENAME);
  });
});

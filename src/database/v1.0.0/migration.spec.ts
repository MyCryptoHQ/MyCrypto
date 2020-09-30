import { IAccount, LocalStorage } from '@types';

import { migrate } from './migration';

describe('Migrate to v1.0.0', () => {
  const getPrev = ({ assets = {}, ...rest }: any = {}) =>
    (({
      ...rest,
      settings: {},
      assets: Object.assign({}, assets)
    } as unknown) as LocalStorage);

  const getCurr = ({ assets = {}, ...rest }: any = {}) =>
    (({
      ...rest,
      assets: Object.assign({}, assets, {
        newUUID: {
          ticker: 'GOA',
          uuid: 'newUUID',
          networkId: 'Ropsten'
        }
      })
    } as unknown) as LocalStorage);

  it('modifies only accounts and settings', () => {
    const prev = getPrev();
    const curr = getCurr();
    const res = migrate(prev, curr);
    expect(Object.keys(res)).toContain('settings');
    expect(Object.keys(res)).toContain('accounts');
  });
  it('ignores old keys', () => {
    const prev = getPrev();
    const curr = getCurr();
    const res = migrate(prev, curr);
    expect(Object.keys(res)).not.toContain('useless');
  });
  it('returns a new object', () => {
    const prev = getPrev();
    const curr = getCurr();
    const res = migrate(prev, curr);
    expect(res).not.toBe(curr); // checek by reference
  });
  it('includes previous accounts', () => {
    const prev = getPrev({ accounts: { '0x01': { uuid: '0x01' } } });
    const curr = getCurr();
    const res = migrate(prev, curr);
    expect(Object.keys(res.accounts)).toContain('0x01');
  });
  it('adds account uuids to labels', () => {
    const prev = getPrev({
      accounts: {
        '0x01': { uuid: '0x01', assets: [{ balance: 3, uuid: 'oldUuid' }] }
      }
    });
    const curr = getCurr();
    const res = migrate(prev, curr);
    expect(res.settings.dashboardAccounts).toEqual(['0x01']);
  });
  it('updates accounts asset uuids', () => {
    const prev = getPrev({
      accounts: {
        '0x01': {
          uuid: '0x01',
          assets: [{ balance: 3, uuid: 'oldUuid' }],
          networkId: 'Ropsten'
        }
      },
      assets: {
        oldUuid: {
          ticker: 'GOA',
          uuid: 'oldUuid',
          networkId: 'Ropsten'
        }
      }
    });
    const curr = getCurr();
    const res = migrate(prev, curr);

    const account = (res.accounts as Record<any, IAccount>)['0x01'];
    expect(account.assets).toContainEqual({
      uuid: 'newUUID',
      balance: 3
    });
  });
});

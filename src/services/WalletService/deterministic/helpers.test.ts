import { clone } from 'ramda';

import { TAddress } from '@types';

// eslint-disable-next-line jest/no-mocks-import
import { fixtures } from './__mocks__';
import { processScannedAccounts as process, sortAccountDisplayItems } from './helpers';
import { DWAccountDisplay } from './types';

interface TInputToSerialize {
  address: string;
  pathItem: {
    path: string;
    baseDPath: {
      name: string;
      path: string;
      offset: number;
      numOfAddresses: number;
    };
    index: number;
  };
  balance: string;
}

const serialize = (item: TInputToSerialize): DWAccountDisplay => {
  return clone({
    ...item,
    address: item.address as TAddress,
    balance: item.balance
  });
};

describe('deterministic wallets helpers - processScannedAccounts', () => {
  const GAP_TO_USE = 5;
  it('processes done scannedAccounts and empty customdpaths to done', () => {
    const output = process(fixtures.scannedAccountsDone.map(serialize), [], GAP_TO_USE);
    expect(output).toStrictEqual(fixtures.processScannedAccountsDone);
  });
  it('processes pending scannedAccounts and empty customdpaths to pending', () => {
    const output = process(fixtures.scannedAccountsPending.map(serialize), [], GAP_TO_USE);
    expect(output).toStrictEqual(fixtures.processScannedAccountsPending);
  });
  it('processes done scannedAccounts w/done customdpaths to done', () => {
    const output = process(
      fixtures.customDPathsDone.map(serialize),
      fixtures.customDPaths,
      GAP_TO_USE
    );
    expect(output).toStrictEqual(fixtures.processScannedAccountsCustomDPathsDone);
  });
  it('processes pending scannedAccounts w/pending customdpaths to pending', () => {
    const output = process(
      fixtures.customDPathsPending.map(serialize),
      fixtures.customDPaths,
      GAP_TO_USE
    );
    expect(output).toStrictEqual(fixtures.processScannedAccountsCustomDPathsPending);
  });
});

describe('deterministic wallets helpers - sortAccountDisplayItems', () => {
  it('sorts account display items correctly based on index', () => {
    const outputArr = sortAccountDisplayItems(fixtures.scannedAccountsDone);
    expect(outputArr).toMatchSnapshot();
  });
});

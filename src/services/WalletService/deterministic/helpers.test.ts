import Bignumber from 'bignumber.js';
import { clone } from 'ramda';

import { TAddress } from '@types';

// eslint-disable-next-line jest/no-mocks-import
import { fixtures } from './__mocks__';
import { processFinishedAccounts as process, sortAccountDisplayItems } from './helpers';
import { DWAccountDisplay } from './types';

interface TInputToSerialize {
  address: string;
  pathItem: {
    path: string;
    baseDPath: {
      label: string;
      value: string;
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
    balance: new Bignumber(item.balance)
  });
};

describe('deterministic wallets helpers - processFinishedAccounts', () => {
  const GAP_TO_USE = 5;
  it('processes done finishedAccounts and empty customdpaths to done', () => {
    const output = process(fixtures.finishedAccountsDone.map(serialize), [], GAP_TO_USE);
    expect(output).toStrictEqual(fixtures.processFinishedAccountsDone);
  });
  it('processes pending finishedAccounts and empty customdpaths to pending', () => {
    const output = process(fixtures.finishedAccountsPending.map(serialize), [], GAP_TO_USE);
    expect(output).toStrictEqual(fixtures.processFinishedAccountsPending);
  });
  it('processes done finishedAccounts w/done customdpaths to done', () => {
    const output = process(
      fixtures.customDPathsDone.map(serialize),
      fixtures.customDPaths,
      GAP_TO_USE
    );
    expect(output).toStrictEqual(fixtures.processFinishedAccountsCustomDPathsDone);
  });
  it('processes pending finishedAccounts w/pending customdpaths to pending', () => {
    const output = process(
      fixtures.customDPathsPending.map(serialize),
      fixtures.customDPaths,
      GAP_TO_USE
    );
    expect(output).toStrictEqual(fixtures.processFinishedAccountsCustomDPathsPending);
  });
});

describe('deterministic wallets helpers - sortAccountDisplayItems', () => {
  it('sorts account display items correctly based on index', () => {
    const outputArr = sortAccountDisplayItems(fixtures.finishedAccountsDone);
    expect(outputArr).toMatchSnapshot();
  });
});

import React from 'react';

import { simpleRender } from 'test-utils';

import { translateRaw } from '@translations';

import { EnsTable } from '../EnsTable';
import { DomainNameRecord } from '../types';

/* Test components */
describe('ENSTable', () => {
  const component = (records: DomainNameRecord[], isFetched: boolean) => (
    <EnsTable records={records} isFetched={isFetched} />
  );

  const renderComponent = (records: DomainNameRecord[], isFetched: boolean) => {
    return simpleRender(component(records, isFetched));
  };

  test('Can render loading spinner state of component', () => {
    const { container } = renderComponent([], false);
    expect(container.querySelector('svg')).toBeDefined();
  });

  test('Can render no-domains state of component', () => {
    const { getByText } = renderComponent([], true);
    const selector = translateRaw('ENS_DOMAINS_NO_DOMAINS').trim();
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('Can render domains co', () => {
    const testRecords = [
      {
        owner: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
        ownerLabel: 'MyCrypto Tip Jar',
        domainName: 'donate.mycryptoid.eth',
        expiryDate: 1589234757,
        readableDomainName: 'donate.mycryptoid.eth'
      }
    ];
    const { getByText } = renderComponent(testRecords, true);
    const selector = translateRaw('ENS_MY_DOMAINS_TABLE_EXPIRES_HEADER').trim();
    expect(getByText(selector)).toBeInTheDocument(); // Expect to see the Network selection step
  });
});

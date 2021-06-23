import { simpleRender } from 'test-utils';

import { translateRaw } from '@translations';
import { DomainNameRecord } from '@types';

import { EnsTable } from '../EnsTable';

/* Test components */
describe('ENSTable', () => {
  const renderComponent = (records: DomainNameRecord[], isFetched: boolean) =>
    simpleRender(<EnsTable records={records} isFetched={isFetched} />);

  test('Can render no-domains state of component', () => {
    const { getByText } = renderComponent([], true);
    const selector = translateRaw('ENS_DOMAINS_NO_DOMAINS').trim();
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('Can render loading spinner state of component', () => {
    const { container } = renderComponent([], false);
    expect(container.querySelector('svg')).toBeDefined();
  });

  test('Can render domains co', () => {
    const testRecords = [
      {
        owner: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
        ownerLabel: 'MyCrypto Tip Jar',
        domainName: 'donate.mycryptoid.eth',
        expiryDate: '1589234757',
        readableDomainName: 'donate.mycryptoid.eth'
      }
    ];
    const { getByText } = renderComponent(testRecords, true);
    const selector = translateRaw('ENS_MY_DOMAINS_TABLE_EXPIRES_HEADER').trim();
    expect(getByText(selector)).toBeInTheDocument(); // Expect to see the Network selection step
  });
});

import React from 'react';

import { ProvidersWrapper } from 'test-utils';

import { ExtendedContentPanel } from '@components';
import { fAssets, fDWAccounts, fNetworks } from '@fixtures';
import { noOp } from '@utils';

import {
  default as DeterministicTable,
  DeterministicTableProps,
  ITableAccounts
} from './DeterministicAccountTable';

export default { title: 'Organisms/DeterministicAccountTable' };

const addressMap = fDWAccounts.reduce((acc, item) => {
  acc[item.address as string] = {
    ...item,
    isSelected: true
  };
  return acc;
}, {} as ITableAccounts);

const initialProps: DeterministicTableProps = {
  isCompleted: true,
  network: fNetworks[0],
  accounts: addressMap,
  asset: fAssets[0],
  displayEmptyAddresses: true,
  selectedDPath: {
    ...fDWAccounts[0].pathItem,
    label: 'Default ETH DPath',
    value: '0.001'
  },
  csv: '',
  onSelect: noOp,
  handleUpdate: noOp,
  onScanMoreAddresses: noOp
};

export const DeterministicAccountTable = () => (
  <ProvidersWrapper>
    <ExtendedContentPanel width="800px">
      <DeterministicTable {...initialProps} />
    </ExtendedContentPanel>
  </ProvidersWrapper>
);

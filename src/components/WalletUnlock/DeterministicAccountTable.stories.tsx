import React from 'react';

import { fAssets, fDWAccounts, fNetworks } from '@fixtures';
import { noOp } from '@utils';

import {
  default as DeterministicTable,
  DeterministicTableProps,
  ITableAccounts
} from './DeterministicAccountTable';

export default { title: 'Hardware/DeterministicAccountTable' };

const addressMap = fDWAccounts.reduce((acc, item) => {
  acc[item.address as string] = {
    ...item,
    isSelected: true,
    isDefaultConfig: true
  };
  return acc;
}, {} as ITableAccounts);

const initialProps: DeterministicTableProps = {
  isComplete: true,
  network: fNetworks[0],
  accounts: addressMap,
  asset: fAssets[0],
  displayEmptyAddresses: true,
  selectedDPath: {
    ...fDWAccounts[0].pathItem,
    label: 'default dpath',
    value: '0.001'
  },
  csv: '',
  onSelect: noOp,
  handleUpdate: noOp,
  handleScanMoreAddresses: noOp
};

export const DeterministicAccountTable = () => {
  return (
    <div className="sb-container" style={{ maxWidth: '620px' }}>
      <DeterministicTable {...initialProps} />
    </div>
  );
};

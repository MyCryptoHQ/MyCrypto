import { ExtendedContentPanel } from '@components';
import { fAssets, fDWAccounts, fNetworks } from '@fixtures';
import { noOp } from '@utils';

import { default as HDTable, HDTableProps, ITableAccounts } from './HDWTable';

export default { title: 'Organisms/HDWTable' };

const addressMap = fDWAccounts.reduce((acc, item) => {
  acc[item.address as string] = {
    ...item,
    isSelected: true
  };
  return acc;
}, {} as ITableAccounts);

const initialProps: HDTableProps = {
  isCompleted: true,
  network: fNetworks[0],
  accounts: addressMap,
  asset: fAssets[0],
  displayEmptyAddresses: true,
  selectedDPath: fDWAccounts[0].pathItem.baseDPath,
  csv: '',
  onSelect: noOp,
  handleUpdate: noOp,
  onScanMoreAddresses: noOp
};

export const HDWTable = () => (
  <ExtendedContentPanel width="800px">
    <HDTable {...initialProps} />
  </ExtendedContentPanel>
);

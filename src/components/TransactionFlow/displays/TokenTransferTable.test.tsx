// import { ComponentProps } from 'react';

// import { fireEvent, simpleRender } from 'test-utils';

// import {
//   fAccount,
//   fSettings,
//   fValueTransfers
// } from '@fixtures';
// import { truncate } from '@utils';

// import { TokenTransferTable } from './TokenTransferTable';

// const defaultProps: ComponentProps<typeof TokenTransferTable> = {
//   valueTransfers: fValueTransfers.map(t => ({ ...t, rate: 0.01 })),
//   settings: fSettings
// };

// function getComponent(props: ComponentProps<typeof TokenTransferTable>) {
//   return simpleRender(<TokenTransferTable {...props} />);
// }

// describe('TransactionDetailsDisplay', () => {
//   test('it renders the TokenTransferTable', async () => {
//     const { getAllByText, container } = getComponent(defaultProps);
//     fireEvent.click(container.querySelector('button')!);
//     expect(getAllByText(truncate(fAccount.address))).toBeDefined();
//   });
// });

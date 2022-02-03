import { ComponentProps } from 'react';

import { fireEvent, simpleRender } from 'test-utils';

import { getFiat } from '@config';
import {
  fSettings,
  fValueTransfers
} from '@fixtures';
import { translateRaw } from '@translations';
import { truncate } from '@utils';

import { TokenTransferTable } from './TokenTransferTable';

const defaultProps: ComponentProps<typeof TokenTransferTable> = {
  valueTransfers: fValueTransfers.map(t => ({ ...t, rate: 0.1, toContact: undefined, fromContact: undefined })),
  settings: fSettings
};

function getComponent(props: ComponentProps<typeof TokenTransferTable>) {
  return simpleRender(<TokenTransferTable {...props} />);
}

describe('TokenTransferTable', () => {
  test('it renders the TokenTransferTable and can view transfers even when unknown tokens are sent', async () => {
    const { getAllByText, container } = getComponent(defaultProps);
    fireEvent.click(container.querySelector('svg')!);
    expect(getAllByText(truncate(fValueTransfers[0].to))).toBeDefined();
    expect(getAllByText(translateRaw('GENERIC_ERC20_NAME'))).toBeDefined()
  });

  test('it renders the TokenTransferTable and can view transfers fiat rate when known tokens are sent', async () => {
    const { getAllByText, container } = getComponent({ ...defaultProps, valueTransfers: defaultProps.valueTransfers.map(t => ({ ...t, amount: '1' })) });
    fireEvent.click(container.querySelector('svg')!);
    expect(getAllByText(truncate(fValueTransfers[0].to))).toBeDefined();
    expect(getAllByText(`${getFiat(fSettings).symbol}${defaultProps.valueTransfers[0].rate.toFixed(2)}`)).toBeDefined()
  });
});

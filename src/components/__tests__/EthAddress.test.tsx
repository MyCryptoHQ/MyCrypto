import React from 'react';
import { simpleRender, fireEvent } from 'test-utils';

import { truncate } from '@utils';

import EthAddress, { Props } from '../EthAddress';

const defaultProps: Props = {
  address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
  truncate
};

function getComponent(props: Props) {
  return simpleRender(<EthAddress {...props} />);
}

// @ts-ignore
navigator.clipboard = { writeText: jest.fn() };

describe('EthAddress', () => {
  test('it shows the address untruncated', async () => {
    const { getByText } = getComponent({ ...defaultProps, truncate: undefined });
    expect(getByText(defaultProps.address)).toBeDefined();
  });

  test('it shows the address truncated', async () => {
    const { getByText } = getComponent(defaultProps);
    expect(getByText(truncate(defaultProps.address))).toBeDefined();
  });

  test('it is copyable', async () => {
    const { getByText } = getComponent({ ...defaultProps, isCopyable: true });
    const element = getByText(truncate(defaultProps.address));
    expect(element).toBeDefined();
    fireEvent.click(element);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(defaultProps.address);
  });
});

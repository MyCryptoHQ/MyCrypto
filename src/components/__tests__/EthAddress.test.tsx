import React from 'react';
import { simpleRender, fireEvent } from 'test-utils';

import { truncate } from '@utils';

import EthAddress from '../EthAddress';

const defaultProps: React.ComponentProps<typeof EthAddress> = {
  address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
  truncate: true
};

function getComponent(props: React.ComponentProps<typeof EthAddress>) {
  return simpleRender(<EthAddress {...props} />);
}

describe('EthAddress', () => {
  test('it displays the address untruncated', async () => {
    const { getByText } = getComponent({ ...defaultProps, truncate: false });
    expect(getByText(defaultProps.address)).toBeDefined();
  });

  test('it displays the address truncated', async () => {
    const { getByText } = getComponent(defaultProps);
    expect(getByText(truncate(defaultProps.address))).toBeDefined();
  });

  test('by default it is copyable', async () => {
    const { getByText } = getComponent(defaultProps);
    const element = getByText(truncate(defaultProps.address));
    expect(element).toBeDefined();

    // @ts-ignore
    navigator.clipboard = { writeText: jest.fn() };

    fireEvent.click(element);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(defaultProps.address);
  });

  test('it is non-copyable', async () => {
    const { getByText } = getComponent({ ...defaultProps, isCopyable: false });
    const element = getByText(truncate(defaultProps.address));
    expect(element).toBeDefined();

    // @ts-ignore
    navigator.clipboard = { writeText: jest.fn() };

    fireEvent.click(element);
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(0);
  });
});

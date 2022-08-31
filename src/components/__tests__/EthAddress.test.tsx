import { ComponentProps } from 'react';

import { fireEvent, simpleRender } from 'test-utils';

import { noOp, truncate } from '@utils';

import EthAddress from '../EthAddress';

const defaultProps: ComponentProps<typeof EthAddress> = {
  address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
  truncate: true
};

function getComponent(props: ComponentProps<typeof EthAddress>) {
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

    Object.assign(navigator, {
      clipboard: {
        writeText: noOp
      }
    });
    jest.spyOn(navigator.clipboard, 'writeText');

    fireEvent.click(element);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(defaultProps.address);
  });

  test('it is non-copyable', async () => {
    const { getByText } = getComponent({ ...defaultProps, isCopyable: false });
    const element = getByText(truncate(defaultProps.address));
    expect(element).toBeDefined();

    Object.assign(navigator, {
      clipboard: {
        writeText: noOp
      }
    });
    jest.spyOn(navigator.clipboard, 'writeText');

    fireEvent.click(element);
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(0);
  });
});

import { ComponentProps } from 'react';

import { fireEvent, simpleRender, waitFor } from 'test-utils';

import { DEFAULT_NETWORK } from '@config';
import { translateRaw } from '@translations';
import { TAddress } from '@types';

import { EditableAccountLabel } from './EditableAccountLabel';

type Props = ComponentProps<typeof EditableAccountLabel>;
const defaultProps: Props = {
  updateUserActionStateByName: jest.fn() as any,
  createOrUpdateContact: jest.fn() as any,
  address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress,
  networkId: DEFAULT_NETWORK,
  addressBookEntry: undefined
};

function getComponent(props: Props) {
  return simpleRender(<EditableAccountLabel {...props} />);
}

const enter = { key: 'Enter', keyCode: 13 };

describe('EditableAccountLabel', () => {
  test('it enters edit mode when clicked and can be cancelled with escape', async () => {
    const { getByText, container } = getComponent(defaultProps);
    const text = getByText(translateRaw('NO_LABEL'));
    fireEvent.click(text);
    const input = container.querySelector('input') as HTMLElement;
    expect(input).toBeDefined();
    input.focus();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(getByText(translateRaw('NO_LABEL'))).toBeDefined();
  });

  test('it enters edit mode when clicked and new address book input can be saved with enter', async () => {
    const { getByText, container } = getComponent(defaultProps);
    const text = getByText(translateRaw('NO_LABEL'));
    fireEvent.click(text);
    const input = container.querySelector('input') as HTMLElement;
    const inputString = 'eth.eth';
    expect(input).toBeDefined();
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: inputString } });
    input.focus();
    await waitFor(() => fireEvent.keyDown(input, enter));
    expect(defaultProps.createOrUpdateContact).toHaveBeenCalledWith(
      expect.objectContaining({ label: inputString })
    );
  });

  test('it enters edit mode when clicked and exits when focus lost', async () => {
    const { getByText, container } = getComponent(defaultProps);
    const text = getByText(translateRaw('NO_LABEL'));
    fireEvent.click(text);
    const input = container.querySelector('input') as HTMLElement;
    expect(input).toBeDefined();
    input.blur();
    expect(getByText(translateRaw('NO_LABEL'))).toBeDefined();
  });
});

import React from 'react';
import selectEvent from 'react-select-event';

import { simpleRender, screen, fireEvent } from 'test-utils';
import { fAccounts } from '@fixtures';
import AccountSelector from './AccountSelector';

type Props = React.ComponentProps<typeof AccountSelector>;

function getComponent(props: Props) {
  return simpleRender(
    <form role="form">
      <AccountSelector {...props} />
    </form>
  );
}

describe('AccountSelector', () => {
  let defaultProps: Props;

  beforeEach(() => {
    defaultProps = {
      accounts: fAccounts,
      name: '',
      value: null,
      onSelect: jest.fn()
    };
  });

  test('it displays the first account by default', async () => {
    getComponent(defaultProps);

    expect(screen.getByText(defaultProps.accounts[0].label)).toBeDefined();
  });

  test('it displays the baseAsset ticker by default', async () => {
    getComponent(defaultProps);

    expect(screen.getByText(/RopstenETH/i)).toBeInTheDocument();
  });

  test('it displays the list of accounts on click', async () => {
    const props = Object.assign({}, defaultProps);
    getComponent(props);

    await selectEvent.openMenu(screen.getByText(defaultProps.accounts[0].label));

    defaultProps.accounts
      .map((a) => a.label)
      .forEach((t) => expect(screen.getByText(t)).toBeInTheDocument());
  });

  // test('it calls the success handler with the correct value', async () => {
  //   const props = Object.assign({}, defaultProps);
  //   getComponent(props);

  //   expect(screen.getByRole('form')).toHaveFormValues({ [defaultProps.label!]: '' });
  //   await selectEvent.openMenu(screen.getByLabelText(defaultProps.label!));
  //   const option = screen.getByTestId(`asset-dropdown-option-${fAssets[0].ticker}`);
  //   fireEvent.pointerDown(option);
  //   expect(defaultProps.onSelect).toBeCalledWith(fAssets[0]);
  // });
});

// const itemProps: ItemProps = {
//   symbol: 'ETH' as TSymbol,
//   name: 'Ether',
//   uuid: ETHUUID as TUuid,
//   onClick: jest.fn()
// };

// function getComponentItem({ symbol, uuid, name, onClick }: ItemProps) {
//   return simpleRender(
//     <AssetSelectorItem symbol={symbol} uuid={uuid} name={name} onClick={onClick} />
//   );
// }

// describe('AssetSelectorItem', () => {
//   test('it renders the asset icon', async () => {
//     const { getByRole } = getComponentItem(itemProps);
//     expect(getByRole('img').getAttribute('src')).toContain('test-file-stub');
//   });

//   test('it displays the asset symbol and name', async () => {
//     const { getByText } = getComponentItem(itemProps);
//     expect(getByText(itemProps.symbol)).toBeDefined();
//     expect(getByText(itemProps.name!)).toBeDefined();
//   });

//   test('it triggers handler on click', async () => {
//     const { container } = getComponentItem(itemProps);
//     const component = container.querySelector('div[class^="AssetSelector__SContainer"]');
//     fireEvent.pointerDown(component!);
//     expect(itemProps.onClick).toHaveBeenCalledTimes(1);
//   });
// });

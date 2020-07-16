import React from 'react';
import selectEvent from 'react-select-event';

import { simpleRender, screen, fireEvent } from 'test-utils';
import { fAssets } from '@fixtures';
import { Asset, TSymbol, TUuid } from '@types';
import { translateRaw } from '@translations';
import { ETHUUID } from '@utils';

import AssetSelector, { AssetSelectorProps, ItemProps, AssetSelectorItem } from '../AssetSelector';

const defaultProps: AssetSelectorProps<Asset> = {
  assets: fAssets as Asset[],
  selectedAsset: null,
  label: 'test-asset-selector',
  onSelect: jest.fn()
};

function getComponent(props: AssetSelectorProps<Asset>) {
  return simpleRender(
    <form role="form">
      <AssetSelector {...props} />
    </form>
  );
}

describe('AssetSelector', () => {
  test('it displays placeholder text when selectedAsset is empty', async () => {
    getComponent(defaultProps);
    expect(screen.getByText(translateRaw('SEND_ASSETS_ASSET_SELECTION_PLACEHOLDER'))).toBeDefined();
  });

  test('it displays asset name when selectedAsset is provided', async () => {
    const props = Object.assign({}, defaultProps, { selectedAsset: fAssets[0] });
    getComponent(props);
    expect(screen.getByText(fAssets[0].ticker)).toBeInTheDocument();
  });

  test('it displays the list of assets on click', async () => {
    const props = Object.assign({}, defaultProps);
    getComponent(props);

    await selectEvent.openMenu(screen.getByLabelText(defaultProps.label!));
    fAssets
      .map((a) => a.ticker)
      .forEach((t) => expect(screen.getByTestId(`asset-dropdown-option-${t}`)).toBeInTheDocument());
  });

  test('it calls the success handler with the correct value', async () => {
    const props = Object.assign({}, defaultProps);
    getComponent(props);

    expect(screen.getByRole('form')).toHaveFormValues({ [defaultProps.label!]: '' });
    await selectEvent.openMenu(screen.getByLabelText(defaultProps.label!));
    const option = screen.getByTestId(`asset-dropdown-option-${fAssets[0].ticker}`);
    fireEvent.pointerDown(option);
    expect(defaultProps.onSelect).toBeCalledWith(fAssets[0]);
  });
});

const itemProps: ItemProps = {
  symbol: 'ETH' as TSymbol,
  name: 'Ether',
  uuid: ETHUUID as TUuid,
  onClick: jest.fn()
};

function getComponentItem({ symbol, uuid, name, onClick }: ItemProps) {
  return simpleRender(
    <AssetSelectorItem symbol={symbol} uuid={uuid} name={name} onClick={onClick} />
  );
}

describe('AssetSelectorItem', () => {
  test('it renders the asset icon', async () => {
    const { getByRole } = getComponentItem(itemProps);
    expect(getByRole('img').getAttribute('src')).toContain('test-file-stub');
  });

  test('it displays the asset symbol and name', async () => {
    const { getByText } = getComponentItem(itemProps);
    expect(getByText(itemProps.symbol)).toBeDefined();
    expect(getByText(itemProps.name!)).toBeDefined();
  });

  test('it triggers handler on click', async () => {
    const { container } = getComponentItem(itemProps);
    const component = container.querySelector('div[class^="AssetSelector__SContainer"]');
    fireEvent.pointerDown(component!);
    expect(itemProps.onClick).toHaveBeenCalledTimes(1);
  });
});

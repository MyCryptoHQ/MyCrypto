import { ComponentProps } from 'react';

import selectEvent from 'react-select-event';
import { fireEvent, screen, simpleRender } from 'test-utils';

import { ETHUUID } from '@config';
import { fAssets } from '@fixtures';
import { SPACING } from '@theme';
import { translateRaw } from '@translations';
import { Asset, TTicker, TUuid } from '@types';

import AssetSelector, { AssetSelectorItem } from './AssetSelector';

const defaultProps: ComponentProps<typeof AssetSelector> = {
  assets: fAssets as Asset[],
  selectedAsset: null,
  showAssetName: true,
  label: 'test-asset-selector',
  onSelect: jest.fn()
};

function getComponent(props: ComponentProps<typeof AssetSelector>) {
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
    expect(screen.getByText(`${fAssets[0].ticker} - ${fAssets[0].name}`)).toBeInTheDocument();
  });

  test('it is searchable by name', async () => {
    const props = Object.assign({}, defaultProps, { searchable: true, showAssetName: true });
    const { container } = getComponent(props);
    fireEvent.change(container.querySelector('input')!, { target: { value: fAssets[0].name } });
    expect(screen.getAllByText(fAssets[0].name)).toHaveLength(1);
  });

  test('it is searchable by symbol', async () => {
    const props = Object.assign({}, defaultProps, { searchable: true, showAssetName: false });
    const { container } = getComponent(props);
    fireEvent.change(container.querySelector('input')!, { target: { value: fAssets[5].ticker } });
    expect(screen.getAllByText(fAssets[5].ticker)).toHaveLength(2);
  });

  test('it displays the list of assets on click', async () => {
    const props = Object.assign({}, defaultProps);
    getComponent(props);

    await selectEvent.openMenu(screen.getByLabelText(defaultProps.label!));
    fAssets
      .map((a) => a.ticker)
      .forEach((t) => expect(screen.getByTestId(`asset-selector-option-${t}`)).toBeInTheDocument());
  });

  test('it calls the success handler with the correct value', async () => {
    const props = Object.assign({}, defaultProps);
    getComponent(props);

    expect(screen.getByRole('form')).toHaveFormValues({ [defaultProps.label!]: '' });
    await selectEvent.openMenu(screen.getByLabelText(defaultProps.label!));
    const option = screen.getByTestId(`asset-selector-option-${fAssets[0].ticker}`);
    fireEvent.pointerDown(option);
    expect(defaultProps.onSelect).toHaveBeenCalledWith(fAssets[0]);
  });
});

const itemProps: ComponentProps<typeof AssetSelectorItem> = {
  ticker: 'ETH' as TTicker,
  name: 'Ether',
  uuid: ETHUUID as TUuid,
  onClick: jest.fn()
};

function getComponentItem({
  ticker,
  uuid,
  name,
  onClick
}: ComponentProps<typeof AssetSelectorItem>) {
  return simpleRender(
    <AssetSelectorItem
      ticker={ticker}
      uuid={uuid}
      name={name}
      onClick={onClick}
      paddingLeft={SPACING.SM}
    />
  );
}

describe('AssetSelectorItem', () => {
  test('it renders the asset icon', async () => {
    const { getByRole } = getComponentItem(itemProps);
    expect(getByRole('img').getAttribute('src')).toContain('test-file-stub');
  });

  test('it displays the asset ticker and name', async () => {
    const { getByText } = getComponentItem(itemProps);
    expect(getByText(`${itemProps.ticker} - ${itemProps.name}`)).toBeDefined();
  });

  test('it triggers handler on click', async () => {
    const { getByTestId } = getComponentItem(itemProps);
    const component = getByTestId(/asset-selector-option/);
    fireEvent.pointerDown(component!);
    expect(itemProps.onClick).toHaveBeenCalledTimes(1);
  });
});

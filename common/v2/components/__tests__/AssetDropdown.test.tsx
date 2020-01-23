import React from 'react';

import { simpleRender } from 'test-utils';
import { fAssets } from 'fixtures';
import { Asset, TSymbol } from 'v2/types';

import AssetDropdown, { Props } from '../AssetDropdown';

const defaultProps: Props<Asset> = {
  assets: fAssets as Asset[],
  selectedAsset: undefined,
  showOnlyTicker: false,
  disabled: false,
  searchable: false,
  label: '',
  onSelect: jest.fn()
};

function getComponent(props: Props<Asset | { name: string; symbol: TSymbol }>) {
  return simpleRender(<AssetDropdown {...props} />);
}

describe('AssetDropdown', () => {
  test('it displays placeholder text when selectedAsset is undefined', async () => {
    const { getByText } = getComponent(defaultProps);
    expect(getByText('Select an Asset').textContent).toBeDefined();
  });
  test('it displays placeholder text when selectedAsset is empty object', async () => {
    const props = Object.assign({}, defaultProps, { selectedAsset: {} });
    const { getByText } = getComponent(props);
    expect(getByText('Select an Asset').textContent).toBeDefined();
  });
});

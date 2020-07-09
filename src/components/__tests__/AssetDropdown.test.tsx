import React from 'react';
import selectEvent from 'react-select-event';

import { simpleRender, screen, fireEvent } from 'test-utils';
import { fAssets } from '@fixtures';
import { Asset } from '@types';
import { translateRaw } from '@translations';

import AssetDropdown, { Props } from '../AssetDropdown';

const defaultProps: Props<Asset> = {
  assets: fAssets as Asset[],
  selectedAsset: null,
  label: 'test-asset-dropdown',
  onSelect: jest.fn()
};

function getComponent(props: Props<Asset>) {
  return simpleRender(
    <form role="form">
      <AssetDropdown {...props} />
    </form>
  );
}

describe('AssetDropdown', () => {
  test('it displays placeholder text when selectedAsset is empty', async () => {
    getComponent(defaultProps);
    expect(screen.getByText(translateRaw('SEND_ASSETS_ASSET_SELECTION_PLACEHOLDER'))).toBeDefined();
  });

  test('it displays asset name when selectedAsset is provided', async () => {
    const props = Object.assign({}, defaultProps, { selectedAsset: fAssets[0] });
    getComponent(props);
    expect(screen.getByText(fAssets[0].ticker)).toBeInTheDocument();
  });

  test('it displays the list of membership plans on click', async () => {
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

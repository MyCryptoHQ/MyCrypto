import React from 'react';
import selectEvent from 'react-select-event';

import { simpleRender, screen, fireEvent } from 'test-utils';
import { fAssets } from '@fixtures';
import { Asset } from '@types';
import { translateRaw } from '@translations';

import AssetDropdown, { Props } from '../AssetDropdown';

const defaultProps: Props<Asset> = {
  assets: fAssets as Asset[],
  selectedAsset: undefined,
  showOnlySymbol: false,
  disabled: false,
  searchable: false,
  label: 'test-asset-dropdown',
  onSelect: jest.fn()
};

function getComponent(props: Props<Asset>) {
  return simpleRender(
    <form role="form">
      {/* <label htmlFor={defaultProps.label}>{defaultProps.label}</label> */}
      <AssetDropdown {...props} inputId={defaultProps.label} />
    </form>
  );
}

describe('AssetDropdown', () => {
  test('it displays placeholder text when selectedAsset is undefined', async () => {
    const { getByText } = getComponent(defaultProps);
    expect(getByText(translateRaw('SEND_ASSETS_ASSET_SELECTION_PLACEHOLDER'))).toBeDefined();
  });

  test('it displays the list of membership plans on click', async () => {
    const props = Object.assign({}, defaultProps);
    const { getByLabelText, getByTestId } = getComponent(props);

    await selectEvent.openMenu(getByLabelText(defaultProps.label!));
    fAssets
      .map((a) => a.ticker)
      .forEach((t) => expect(getByTestId(`asset-dropdown-option-${t}`)).toBeInTheDocument());
  });

  test('it calls the success handler with the correct value', async () => {
    const props = Object.assign({}, defaultProps);
    const { getByTestId, getByLabelText } = getComponent(props);

    // expect(getByRole('form')).toHaveFormValues({ [defaultProps.label!]: '' });

    await selectEvent.openMenu(getByLabelText(defaultProps.label!));
    const option = getByTestId(`asset-dropdown-option-${fAssets[0].ticker}`);
    screen.debug(option);
    fireEvent.click(option);
    // console.log(fAssets[0].ticker);
    // screen.debug();
    // expect(getByRole('form')).toHaveFormValues({ asset: fAssets[0] });
    expect(defaultProps.onSelect).toBeCalledWith(fAssets[0]);
  });
});

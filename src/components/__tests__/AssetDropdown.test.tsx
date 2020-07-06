import React from 'react';
import selectEvent from 'react-select-event';

import { simpleRender } from 'test-utils';
import { fAssets } from '@fixtures';
import { Asset } from '@types';

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
      <AssetDropdown {...props} />
    </form>
  );
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

  test('it displays the list of membership plans on click', async () => {
    const props = Object.assign({}, defaultProps);
    const { getByLabelText, getByText } = getComponent(props);

    await selectEvent.openMenu(getByLabelText(defaultProps.label!));
    fAssets.map((a) => a.ticker).forEach((t) => expect(getByText(t)).toBeInTheDocument());
  });

  test('it calls the success handler with the correct value', async () => {
    const props = Object.assign({}, defaultProps);
    const { getByRole, getByLabelText } = getComponent(props);

    expect(getByRole('form')).toHaveFormValues({});
    await selectEvent.select(getByLabelText(defaultProps.label!), fAssets[0].ticker);
    expect(defaultProps.onSelect).toBeCalledWith(fAssets[0]);
  });
});

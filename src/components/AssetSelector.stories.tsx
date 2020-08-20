import React, { useState } from 'react';
import { fAssets } from '@fixtures';

import { TSymbol } from '@types';
import { translateRaw } from '@translations';

import AssetSelector, { TAssetOption, AssetSelectorItem } from './AssetSelector';

export default { title: 'Selectors/AssetSelector' };

const initialProps = {
  assets: fAssets,
  showOnlySymbol: false,
  disabled: false,
  fluid: false,
  searchable: false,
  label: translateRaw('X_ASSET')
};

const withForm = (Component: any) => (ownProps: any) => {
  const [formValues, setFormValues] = useState<{ asset: TAssetOption | null }>({ asset: null });
  const defaultProps = {
    ...initialProps,
    selectedAsset: formValues.asset,
    onSelect: (option: TAssetOption) => setFormValues({ asset: option })
  };
  return (
    <div style={{ width: '300px' }}>
      <form>
        <Component {...defaultProps} {...ownProps} />
      </form>
    </div>
  );
};

export const Selector = () => {
  const SelectorDefault = withForm(AssetSelector);
  const SelectorOpen = withForm(AssetSelector);
  const SelectorSelected = withForm(AssetSelector);

  const asset = fAssets[6];
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '80%'
      }}
    >
      <div
        className="sb-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <AssetSelectorItem symbol={asset.ticker as TSymbol} uuid={asset.uuid} name={asset.name} />
        </div>
        <div>
          <AssetSelectorItem symbol={asset.ticker as TSymbol} uuid={asset.uuid} />
        </div>
      </div>
      <div
        className="sb-container"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <SelectorDefault />
        <SelectorOpen menuIsOpen={true} />
        <SelectorSelected selectedAsset={fAssets[0]} />
      </div>
    </div>
  );
};

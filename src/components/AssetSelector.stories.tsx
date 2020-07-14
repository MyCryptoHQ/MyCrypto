import React, { useState } from 'react';
import { fAssets } from '@fixtures';
import { Formik, Form } from 'formik';

import { TSymbol } from '@types';
import { noOp } from '@utils';
import { translateRaw } from '@translations';

import AssetSelector, { TAssetOption, AssetSelectorItem } from './AssetSelector';

export default { title: 'Selectors/AssetSelector' };

const initialProps = {
  assets: fAssets,
  selectedAsset: fAssets[0],
  showOnlySymbol: false,
  disabled: false,
  fluid: false,
  searchable: false,
  label: translateRaw('X_ASSET')
};

export const Selector = () => {
  const [formValues, setFormValues] = useState<{ asset: TAssetOption | null }>({ asset: null });

  const props = {
    ...initialProps,
    onSelect: (option: TAssetOption) => setFormValues({ asset: option })
  };

  const asset = props.selectedAsset;

  return (
    <div
      className="sb-container"
      style={{
        width: '50%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ width: '300px' }}>
        <Formik
          initialValues={formValues}
          onSubmit={noOp}
          render={({ values }) => (
            <Form>
              <AssetSelector {...props} selectedAsset={values.asset} />
            </Form>
          )}
        />
      </div>
      <div style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
        <div>
          <AssetSelectorItem symbol={asset.ticker as TSymbol} uuid={asset.uuid} name={asset.name} />
        </div>
        <div>
          <AssetSelectorItem symbol={asset.ticker as TSymbol} uuid={asset.uuid} />
        </div>
      </div>
    </div>
  );
};

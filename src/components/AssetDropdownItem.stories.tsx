import React, { useState } from 'react';
import { fAssets } from '@fixtures';
import { Formik, Form } from 'formik';

import { TSymbol } from '@types';
import { noOp } from '@utils';
import { translateRaw } from '@translations';

import AssetDropdown, { TAssetOption } from './AssetDropdown';
import AssetDropdownItem from './AssetDropdownItem';
import Divider from './Divider';

export default { title: 'AssetDropdown' };

const initialProps = {
  assets: fAssets,
  selectedAsset: fAssets[0],
  showOnlySymbol: false,
  disabled: false,
  fluid: false,
  searchable: false,
  label: translateRaw('X_ASSET')
};

export const Dropdown = () => {
  const [formValues, setFormValues] = useState<{ asset?: TAssetOption }>({ asset: undefined });

  const props = {
    ...initialProps,
    onSelect: (option: TAssetOption) => setFormValues({ asset: option })
  };

  return (
    <div className="sb-container" style={{ width: '100%', maxWidth: '300px' }}>
      <Formik
        initialValues={formValues}
        onSubmit={noOp}
        render={({ values }) => (
          <Form>
            <AssetDropdown {...props} selectedAsset={values.asset} />
          </Form>
        )}
      />
      <pre>{JSON.stringify(formValues)}</pre>
      <Divider height={'2em'} />
      <Formik
        initialValues={formValues}
        onSubmit={noOp}
        render={({ values }) => (
          <Form>
            <AssetDropdown {...props} selectedAsset={values.asset} />
          </Form>
        )}
      />
      <pre>{JSON.stringify(formValues)}</pre>
    </div>
  );
};

export const DropdownItem = () => {
  const asset = initialProps.selectedAsset;
  return (
    <div className="sb-container" style={{ width: '100%', maxWidth: '300px' }}>
      <AssetDropdownItem symbol={asset.ticker as TSymbol} uuid={asset.uuid} name={asset.name} />

      <Divider height={'2em'} />

      <AssetDropdownItem symbol={asset.ticker as TSymbol} uuid={asset.uuid} />
    </div>
  );
};

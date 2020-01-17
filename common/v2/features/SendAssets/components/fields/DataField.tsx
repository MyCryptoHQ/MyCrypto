import React from 'react';

import { InputField } from 'v2/components';

export function DataField({ value, errors, name, onChange }: IDataField) {
  return (
    <InputField
      {...value}
      name={name}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520"
      className="SendAssetsForm-fieldset-input"
      inputError={errors}
    />
  );
}

interface IDataField {
  value: string;
  name: string;
  errors: string | undefined;
  onChange(entry: string): void;
}

export default DataField;

import React from 'react';

import { Input } from '@mycrypto/ui';

export function DataField({ value, name, onChange }: IDataField) {
  return (
    <Input
      {...value}
      name={name}
      value={value}
      maxLength={10}
      onChange={e => onChange(e.target.value)}
      placeholder="0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520"
      className="SendAssetsForm-fieldset-input"
    />
  );
}

interface IDataField {
  value: string;
  name: string;
  onChange(entry: string): void;
}

export default DataField;

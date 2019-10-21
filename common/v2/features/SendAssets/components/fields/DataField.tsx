import React from 'react';

import { Input } from '@mycrypto/ui';
import { InlineErrorMsg } from 'v2/components/ErrorMessages/InlineErrors';

export function DataField({ value, errors, name, onChange }: IDataField) {
  return (
    <div>
      <Input
        {...value}
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520"
        className="SendAssetsForm-fieldset-input"
      />
      <InlineErrorMsg>{errors}</InlineErrorMsg>
    </div>
  );
}

interface IDataField {
  value: string;
  name: string;
  errors: string | undefined;
  onChange(entry: string): void;
}

export default DataField;

import React from 'react';

import { Input } from '@mycrypto/ui';

export function GasPriceField({ value, name, onChange }: IGasPriceField) {
  return (
    <Input
      {...value}
      name={name}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="20"
      className="SendAssetsForm-fieldset-input"
    />
  );
}

interface IGasPriceField {
  value: string;
  name: string;
  onChange(entry: string): void;
}

export default GasPriceField;

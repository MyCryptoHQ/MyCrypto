import React from 'react';

import { Input } from '@mycrypto/ui';

export function GasPriceField({ value, name, onChange }: IGasPriceField) {
  return (
    <div>
      <Input
        {...value}
        name={name}
        value={value}
        maxLength={6}
        onChange={e => onChange(e.target.value)}
        placeholder="20"
        className="SendAssetsForm-fieldset-input"
      />
    </div>
  );
}

interface IGasPriceField {
  value: string;
  name: string;
  onChange(entry: string): void;
}

export default GasPriceField;

import React from 'react';

import { Input } from '@mycrypto/ui';

export function GasLimitField({ value, disabled, name, onChange }: IGasLimitField) {
  return (
    <div>
      <Input
        {...value}
        name={name}
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        placeholder="21000"
        className="SendAssetsForm-fieldset-input"
      />
    </div>
  );
}

interface IGasLimitField {
  value: string;
  disabled: boolean;
  name: string;
  onChange(entry: string): void;
}

export default GasLimitField;

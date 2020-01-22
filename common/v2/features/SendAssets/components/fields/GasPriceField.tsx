import React from 'react';

import { InputField } from 'v2/components';

export function GasPriceField({ value, name, onChange }: IGasPriceField) {
  return (
    <div>
      <InputField
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

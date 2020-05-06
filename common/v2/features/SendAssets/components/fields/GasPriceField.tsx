import React from 'react';

import { InputField } from 'v2/components';

export function GasPriceField({ value, name, onChange, error }: IGasPriceField) {
  return (
    <div>
      <InputField
        {...value}
        name={name}
        value={value}
        maxLength={6}
        onChange={(e) => onChange(e.target.value)}
        placeholder="20"
        className="SendAssetsForm-fieldset-input"
        inputError={error}
        inputMode="decimal"
      />
    </div>
  );
}

interface IGasPriceField {
  value: string;
  name: string;
  error?: string | JSX.Element | undefined;
  onChange(entry: string): void;
}

export default GasPriceField;

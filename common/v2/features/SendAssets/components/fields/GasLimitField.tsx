import React from 'react';

import { InputField } from 'v2/components';

export function GasLimitField({ value, name, onChange, disabled }: IGasLimitField) {
  return (
    <div>
      <InputField
        {...value}
        name={name}
        value={value}
        maxLength={7}
        onChange={e => onChange(e.target.value)}
        placeholder="21000"
        className="SendAssetsForm-fieldset-input"
        disabled={disabled}
      />
    </div>
  );
}

interface IGasLimitField {
  value: string;
  name: string;
  disabled?: boolean;
  onChange(entry: string): void;
}

export default GasLimitField;

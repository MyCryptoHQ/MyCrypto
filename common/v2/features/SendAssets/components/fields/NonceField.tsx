import React from 'react';

import { InputField } from 'v2/components';

export function NonceField({ value, name, onChange }: INonceField) {
  return (
    <div>
      <InputField
        {...value}
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="0"
        className="SendAssetsForm-fieldset-input"
      />
    </div>
  );
}

interface INonceField {
  value: string;
  name: string;
  onChange(entry: string): void;
}

export default NonceField;

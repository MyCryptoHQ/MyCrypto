import React from 'react';

import { Input } from '@mycrypto/ui';

export function NonceField({ value, name, onChange }: INonceField) {
  return (
    <Input
      {...value}
      name={name}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="0"
      className="SendAssetsForm-fieldset-input"
    />
  );
}

interface INonceField {
  value: string;
  name: string;
  onChange(entry: string): void;
}

export default NonceField;

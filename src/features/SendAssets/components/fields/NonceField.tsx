import { InputField } from '@components';

export function NonceField({ value, name, onChange, error, disabled }: INonceField) {
  return (
    <div>
      <InputField
        {...value}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="SendAssetsForm-fieldset-input"
        inputError={error}
        inputMode="decimal"
        disabled={disabled}
      />
    </div>
  );
}

interface INonceField {
  value: string;
  name: string;
  error?: string | JSX.Element | undefined;
  disabled?: boolean;
  onChange(entry: string): void;
}

export default NonceField;

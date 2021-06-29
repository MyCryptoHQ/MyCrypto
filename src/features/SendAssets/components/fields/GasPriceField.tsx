import { InputField } from '@components';

export function GasPriceField({
  value,
  name,
  onChange,
  error,
  placeholder = '20'
}: IGasPriceField) {
  return (
    <div>
      <InputField
        {...value}
        name={name}
        value={value}
        maxLength={6}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
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
  placeholder?: string;
}

export default GasPriceField;

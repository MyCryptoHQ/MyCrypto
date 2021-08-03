import { Body, Box, Icon, InputField, LinkApp, Tooltip } from '@components';
import { COLORS } from '@theme';

export function GasLimitField({
  value,
  name,
  onChange,
  disabled,
  error,
  label,
  tooltip,
  refresh
}: IGasLimitField) {
  const handleRefreshClicked = () => refresh && refresh();
  return (
    <Box mb="3">
      {label && (
        <Box variant="rowAlign" px="1" pb="1" justifyContent="space-between">
          <Box variant="rowAlign">
            <Body mb="0">{label}</Body>
            <Tooltip ml="1" tooltip={tooltip} />
          </Box>
          {refresh && (
            <Box variant="rowAlign">
              <LinkApp href="#" isExternal={false} onClick={handleRefreshClicked}>
                <Icon fill={COLORS.BLUE_BRIGHT} width="14px" height="14px" type="refresh" />
              </LinkApp>
            </Box>
          )}
        </Box>
      )}
      <InputField
        {...value}
        name={name}
        value={value}
        maxLength={7}
        onChange={(e) => onChange(e.target.value)}
        placeholder="21000"
        className="SendAssetsForm-fieldset-input"
        inputError={error}
        disabled={disabled}
        inputMode="decimal"
      />
    </Box>
  );
}

interface IGasLimitField {
  value: string;
  name: string;
  disabled?: boolean;
  error?: string | JSX.Element | undefined;
  onChange(entry: string): void;
  label?: string;
  tooltip?: string;
  refresh?(): void;
}

export default GasLimitField;

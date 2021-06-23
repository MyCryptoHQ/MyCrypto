import { Input } from '@mycrypto/ui';
import styled from 'styled-components';

import { Asset } from '@types';
import { sanitizeDecimalSeparator } from '@utils';

import AssetIcon from './AssetIcon';
import Box from './Box';
import Typography from './Typography';

interface Props {
  name?: string;
  disabled?: boolean;
  asset: Asset;
  value: string;
  placeholder?: string;
  onChange(event: any): void;
  onBlur?(event: any): void;
}

const SInput = styled(Input)`
  /* Override Typography from mycrypto/ui */
  font-size: 1rem !important;
`;

const SAssetIcon = styled(AssetIcon)`
  margin-right: 1ch;
`;

function AmountInput({ asset, value, onChange, onBlur, placeholder, ...props }: Props) {
  return (
    <SInput
      {...props}
      inputMode="decimal"
      value={value}
      onChange={(e) => {
        e.target.value = sanitizeDecimalSeparator(e.target.value);
        onChange(e);
      }}
      onBlur={onBlur}
      placeholder={placeholder}
      iconSide={'right'}
      icon={() => (
        <Box variant="rowCenter">
          {asset.ticker && <SAssetIcon uuid={asset.uuid} size={'1.5rem'} />}
          <Typography>{asset.ticker}</Typography>
        </Box>
      )}
    />
  );
}

export default AmountInput;

import { TAssetType, TCurrencySymbol, TTicker, TUuid } from '@types';
import { formatCurrency, isFiatTicker } from '@utils';

import AssetIcon from './AssetIcon';
import Box from './Box';
import { Body } from './NewTypography';

interface Props {
  amount: string;
  assetType?: TAssetType;
  symbol?: TCurrencySymbol;
  ticker?: TTicker;
  uuid?: TUuid;
  decimals?: number;
  icon?: boolean;
  bold?: boolean;
  fontSize?: string;
  color?: string;
}

function Currency({
  amount,
  assetType,
  symbol,
  ticker,
  uuid,
  decimals = 5,
  icon = false,
  bold = false,
  fontSize,
  color,
  ...props
}: Props) {
  return (
    <Box variant="rowAlign" display="inline-flex" style={{ fontSize: fontSize }} {...props}>
      {icon && uuid && <AssetIcon uuid={uuid} mr="0.5ch" size="1.2em" />}
      <Body as="span" fontWeight={bold ? 'bold' : 'normal'} fontSize={'inherit'} color={color} textAlign="right">
        {assetType !== 'erc721' && formatCurrency(amount, decimals, ticker)}
        {ticker && !isFiatTicker(ticker) && ` ${symbol ?? ticker}`}
      </Body>
    </Box>
  );
}

export default Currency;

import { ReactElement } from 'react';

import BigNumber from 'bignumber.js';

import { InlineMessage, TranslateMarkdown } from '@components';
import { Fiats, getKBHelpArticle, KB_HELP_ARTICLE } from '@config';
import { TxFeeResponseType, validateTxFee } from '@services/EthService/validators';
import { useRates } from '@services/Rates';
import translate from '@translations';
import { Asset, Fiat, InlineMessageType } from '@types';

import { isERC20Asset } from '../helpers';

interface ConfigType {
  type: InlineMessageType;
  message(fiat: Fiat, fee?: string, amount?: string): ReactElement<typeof TranslateMarkdown>;
}

const CONFIGS: Record<TxFeeResponseType, ConfigType | null> = {
  [TxFeeResponseType.Warning]: {
    type: InlineMessageType.WARNING,
    message: (fiat, fee, amount) =>
      translate('WARNING_TRANSACTION_FEE', {
        $amount: `${fiat.symbol}${amount}`,
        $fee: `${fiat.symbol}${fee}`,
        $link: getKBHelpArticle(KB_HELP_ARTICLE.WHY_IS_GAS)
      })
  },
  [TxFeeResponseType.WarningUseLower]: {
    type: InlineMessageType.WARNING,
    message: (fiat, fee) =>
      translate('TRANSACTION_FEE_NOTICE', {
        $fee: `${fiat.symbol}${fee}`,
        $link: getKBHelpArticle(KB_HELP_ARTICLE.WHY_IS_GAS)
      })
  },
  [TxFeeResponseType.ErrorHighTxFee]: {
    type: InlineMessageType.ERROR,
    message: (fiat, fee) =>
      translate('ERROR_HIGH_TRANSACTION_FEE_HIGH', {
        $fee: `${fiat.symbol}${fee}`,
        $link: getKBHelpArticle(KB_HELP_ARTICLE.WHY_IS_GAS)
      })
  },
  [TxFeeResponseType.ErrorVeryHighTxFee]: {
    type: InlineMessageType.ERROR,
    message: (fiat, fee) =>
      translate('ERROR_HIGH_TRANSACTION_FEE_VERY_HIGH', {
        $fee: `${fiat.symbol}${fee}`,
        $link: getKBHelpArticle(KB_HELP_ARTICLE.WHY_IS_GAS)
      })
  },
  [TxFeeResponseType.WarningHighBaseFee]: {
    type: InlineMessageType.WARNING,
    message: () => translate('BASE_FEE_HIGH')
  },
  [TxFeeResponseType.WarningVeryHighBaseFee]: {
    type: InlineMessageType.WARNING,
    message: () => translate('BASE_FEE_VERY_HIGH')
  },
  [TxFeeResponseType.Invalid]: null,
  [TxFeeResponseType.None]: null
};

interface Props {
  amount: string;
  fiat: Fiat;
  baseAsset: Asset;
  asset: Asset;
  ethAsset: Asset;
  gasLimit: string;
  gasPrice: string;
  baseFee?: BigNumber;
}

export const TxFeeValidation = ({
  amount: inputAmount,
  asset,
  baseAsset,
  ethAsset,
  fiat,
  gasLimit,
  gasPrice,
  baseFee
}: Props) => {
  const { getAssetRateInCurrency } = useRates();

  const { type, amount, fee } = validateTxFee(
    inputAmount,
    getAssetRateInCurrency(baseAsset, Fiats.USD.ticker),
    getAssetRateInCurrency(baseAsset, fiat.ticker),
    isERC20Asset(asset),
    gasLimit,
    gasPrice,
    getAssetRateInCurrency(ethAsset, Fiats.USD.ticker),
    baseFee
  );
  const config = CONFIGS[type];

  const message = config?.message(fiat, fee, amount);

  return config ? <InlineMessage type={config.type} value={message} /> : null;
};

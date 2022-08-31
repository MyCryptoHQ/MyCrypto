import { TTicker } from '@types';

import isFiatTicker from './isFiatTicker';

export const formatCurrency = (value: string, decimalPlaces: number, ticker?: TTicker) => {
  return new Intl.NumberFormat(navigator.language, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    ...(ticker && isFiatTicker(ticker) && { style: 'currency', currency: ticker })
  }).format(parseFloat(value));
};

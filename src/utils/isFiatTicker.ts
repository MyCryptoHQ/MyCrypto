import has from 'ramda/src/has';

import { Fiats } from '@config';
import { TFiatTicker, TTicker } from '@types';

/*
  Typeguard to determine if a given ticker is a TFiatTicker
*/
const isFiatTicker = (ticker: TTicker): ticker is TFiatTicker => has(ticker)(Fiats);

export default isFiatTicker;

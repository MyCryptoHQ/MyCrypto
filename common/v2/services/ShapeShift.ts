import get from 'lodash/get';

import { logError } from 'v2/utils';
import APIService from './API';
import {
  Cache,
  cachedValueIsFresh,
  addValueToCache,
  removeValueFromCache,
  createAssetMap,
  getAssetIntersection
} from './helpers';

type DepositStatus = 'error' | 'complete' | 'no_deposits';

interface DepositStatusResponse {
  status: DepositStatus;
  address: string;
}

interface DepositStatusIncompleteResponse extends DepositStatusResponse {
  error: string;
}

interface DepositStatusCompleteResponse extends DepositStatusResponse {
  withdraw: string;
  incomingCoin: number;
  incomingType: string;
  outcoingCoin: number;
  outgoingType: string;
  transaction: string;
}

type DepositStatusNoneResponse = DepositStatusResponse;

interface MarketPair {
  limit: number;
  maxLimit: number;
  min: number;
  minerFee: number;
  pair: string;
  rate: number;
}

interface RatesResponse {
  pair: string;
  limit: string;
  min: string;
}

interface SendAmountRequest {
  amount: string;
  withdrawal: string;
  pair: string;
  returnAddress: string;
}

interface SendAmountResponse {
  apiPubKey: string;
  deposit: string;
  depositAmount: string;
  expiration: number;
  maxLimit: number;
  minerFee: string;
  orderId: string;
  pair: string;
  quotedRate: string;
  returnAddress: string;
  userId: string;
  withdrawal: string;
  withdrawalAmount: string;
}

interface TimeRemainingResponse {
  status: string;
  seconds_remaining: string;
}

let instantiated = false;

export default class ShapeShiftService {
  public static instance = new ShapeShiftService();

  private cache: Cache = {};

  private service = APIService.generateInstance({
    baseURL: 'https://shapeshift.io',
    headers: {
      Authorization: `Bearer FSa39bx1MY683L9FvYcjWCBSZBg7hUinbGwoqu5wwAma`
    }
  });

  public constructor() {
    if (instantiated) {
      throw new Error(`ShapeShiftService has already been instantiated.`);
    }

    instantiated = true;
  }

  public async getValidPairs(): Promise<string[]> {
    try {
      const cachedPairs = get(this.cache, 'validPairs', {});

      if (cachedValueIsFresh(cachedPairs)) {
        return get(cachedPairs, 'value');
      } else {
        removeValueFromCache(this.cache, 'validPairs');
      }

      const { data } = await this.service.get(`/validpairs`);
      const assetMap = createAssetMap(data);
      const validPairs = getAssetIntersection(Object.keys(assetMap));

      addValueToCache(this.cache, 'validPairs', validPairs);

      return validPairs;
    } catch (error) {
      logError('ShapeShift#getValidPairs', error);

      return [];
    }
  }

  public async getMarketInfo(pair?: string): Promise<MarketPair[] | MarketPair | null> {
    try {
      const url = `/marketinfo/${pair || ''}`;
      const { data: marketInfo } = await this.service.get(url);

      return marketInfo;
    } catch (error) {
      logError('ShapeShift#getMarketInfo', error);

      return pair ? null : [];
    }
  }

  public async getDepositStatus(
    depositAddress: string
  ): Promise<
    | DepositStatusNoneResponse
    | DepositStatusIncompleteResponse
    | DepositStatusCompleteResponse
    | null
  > {
    try {
      const url = `/txstat/${depositAddress}`;
      const { data: status } = await this.service.get(url);

      return status;
    } catch (error) {
      logError('ShapeShift#getDepositStatus', error);

      return null;
    }
  }

  public async getTimeRemaining(depositAddress: string): Promise<TimeRemainingResponse | null> {
    try {
      const url = `/timeremaining/${depositAddress}`;
      const { data: timeRemaining } = await this.service.get(url);

      return timeRemaining;
    } catch (error) {
      logError('ShapeShift#getTimeRemaining', error);

      return null;
    }
  }

  public async getRates(pair: string): Promise<RatesResponse | null> {
    try {
      const url = `/limit/${pair}`;
      const { data: rates } = await this.service.get(url);

      return rates;
    } catch (error) {
      logError('ShapeShift#getRates', error);

      return null;
    }
  }

  public async sendAmount(config: SendAmountRequest): Promise<SendAmountResponse | null> {
    try {
      const { amount, withdrawal, pair, returnAddress } = config;
      const url = '/sendamount';
      const { data: { success } } = await this.service.post(url, {
        amount,
        withdrawal,
        pair,
        returnAddress
      });

      return success;
    } catch (error) {
      logError('ShapeShift#sendAmount', error);

      return null;
    }
  }
}

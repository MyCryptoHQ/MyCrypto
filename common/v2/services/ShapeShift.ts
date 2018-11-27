import { logError } from 'v2/utils';
import APIService from './API';
import {
  addValueToCache,
  createAssetMap,
  getAssetIntersection,
  isSupportedPair,
  createPairHash,
  cacheGrab
} from './helpers';
import {
  Cache,
  MarketPair,
  MarketPairHash,
  DepositStatusCompleteResponse,
  DepositStatusIncompleteResponse,
  DepositStatusNoneResponse,
  TimeRemainingResponse,
  RatesResponse,
  SendAmountRequest,
  SendAmountResponse
} from './types';

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

  private cacheGrab = cacheGrab.bind(this, this.cache);

  private cacheAdd = addValueToCache.bind(this, this.cache);

  public constructor() {
    if (instantiated) {
      throw new Error(`ShapeShiftService has already been instantiated.`);
    }

    instantiated = true;

    this.getValidPairs();

    setTimeout(() => this.getValidPairs(), 5000);
  }

  public async getValidPairs(): Promise<string[]> {
    try {
      const cachedPairs = this.cacheGrab('validPairs');

      if (cachedPairs) {
        console.log('cached');
        return cachedPairs;
      }

      const { data } = await this.service.get(`/validpairs`);
      const assetMap = createAssetMap(data);
      const validPairs = getAssetIntersection(Object.keys(assetMap));

      this.cacheAdd({ validPairs });
      console.log('not cached');
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

  public async getPairInfo(): Promise<MarketPairHash | null> {
    try {
      const cachedPairInfo = this.cacheGrab('pairInfo');

      if (cachedPairInfo) {
        return cachedPairInfo;
      }

      const allAssets = await this.getMarketInfo();

      if (allAssets instanceof Array) {
        const supportedAssets = allAssets.filter((asset: MarketPair) =>
          isSupportedPair(asset.pair)
        );
        const pairInfo = supportedAssets.reduce((prev, next) => createPairHash(prev, next), {});

        this.cacheAdd({ pairInfo });

        return pairInfo;
      }

      throw new Error(
        `ShapeShift#getPairInfo should have received an array, but got ${typeof allAssets}.`
      );
    } catch (error) {
      logError('ShapeShift#getPairInfo', error);

      return null;
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
      const { amount, withdrawal, pair } = config;
      const url = '/sendamount';
      const { data: { success, error } } = await this.service.post(url, {
        amount,
        withdrawal,
        pair
      });

      if (error) {
        throw new Error(error);
      }

      return success;
    } catch (error) {
      logError('ShapeShift#sendAmount', error);

      return null;
    }
  }
}

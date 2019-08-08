import { AxiosInstance } from 'axios';
import queryString from 'query-string';

import { logError, isDesktop } from 'v2/utils';
import { APIService } from '../API';
import { CacheService } from '../Cache';
import {
  SHAPESHIFT_API_URL,
  SHAPESHIFT_ACCESS_TOKEN,
  SHAPESHIFT_AUTHORIZATION_URL,
  SHAPESHIFT_CACHE_IDENTIFIER,
  SHAPESHIFT_CLIENT_ID,
  SHAPESHIFT_REDIRECT_URI,
  SHAPESHIFT_TOKEN_PROXY_URL
} from './constants';
import { createAssetMap, getAssetIntersection, isSupportedPair, createPairHash } from './helpers';
import {
  MarketPair,
  MarketPairHash,
  DepositStatuses,
  TimeRemainingResponse,
  RatesResponse,
  SendAmountRequest,
  SendAmountResponse
} from './types';

export class ShapeShiftServiceBase {
  private token: string | null = null;
  private service: AxiosInstance = APIService.generateInstance({
    baseURL: SHAPESHIFT_API_URL
  });
  private cacheGet = CacheService.instance.getEntry.bind(
    CacheService.instance,
    SHAPESHIFT_CACHE_IDENTIFIER
  );
  private cacheSet = CacheService.instance.setEntry.bind(
    CacheService.instance,
    SHAPESHIFT_CACHE_IDENTIFIER
  );
  private cacheClear = CacheService.instance.clearEntry.bind(
    CacheService.instance,
    SHAPESHIFT_CACHE_IDENTIFIER
  );

  public constructor() {
    const { code } = queryString.parse(window.location.search);

    code ? this.requestAccessToken(code) : this.authorize();

    if (isDesktop()) {
      const { ipcRenderer } = (window as any).require('electron');

      ipcRenderer.on('shapeshift-set-token', (_: any, token: string) => this.authorize(token));
    }
  }

  public async getValidPairs(): Promise<string[]> {
    try {
      const cachedPairs = this.cacheGet('validPairs');

      if (cachedPairs) {
        return cachedPairs;
      }

      const { data } = await this.service.get(`/validpairs`);
      const assetMap = createAssetMap(data);
      const validPairs = getAssetIntersection(Object.keys(assetMap));

      this.cacheSet({ validPairs });

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
      const cachedPairInfo = this.cacheGet('pairInfo');

      if (cachedPairInfo) {
        return cachedPairInfo;
      }

      const allAssets = await this.getMarketInfo();

      if (allAssets instanceof Array) {
        const supportedAssets = allAssets.filter((asset: MarketPair) =>
          isSupportedPair(asset.pair)
        );
        const pairInfo = supportedAssets.reduce((prev, next) => createPairHash(prev, next), {});

        this.cacheSet({ pairInfo });

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

  public async getImages(): Promise<any | null> {
    try {
      const cachedImages = this.cacheGet('images');

      if (cachedImages) {
        return cachedImages;
      }

      const url = '/getcoins';
      const { data: coinsList } = await this.service.get(url);
      const images = Object.entries(coinsList).reduce((prev: any, [key, value]: any) => {
        prev[key] = value.imageSmall;
        return prev;
      }, {});

      this.cacheSet({ images });

      return images;
    } catch (error) {
      logError('ShapeShift#getImages', error);

      return null;
    }
  }

  public async getDepositStatus(depositAddress: string): Promise<DepositStatuses | null> {
    try {
      const url = `/txstat/${depositAddress}`;
      const {
        data: { status }
      } = await this.service.get(url);

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

      this.cacheClear('shift');

      const {
        data: { success: activeShift, error }
      } = await this.service.post(url, {
        amount,
        withdrawal,
        pair
      });

      if (error) {
        throw new Error(error);
      }

      this.cacheSet({ activeShift });

      return activeShift;
    } catch (error) {
      logError('ShapeShift#sendAmount', error);

      return null;
    }
  }

  public isAuthorized(): boolean {
    return Boolean(this.token);
  }

  public getActiveShift(): SendAmountResponse {
    return this.cacheGet('activeShift');
  }

  public clearActiveShift() {
    return this.cacheClear('activeShift');
  }

  public openAuthorizationWindow() {
    const query = queryString.stringify({
      client_id: SHAPESHIFT_CLIENT_ID,
      scope: 'users:read',
      response_type: 'code',
      redirect_uri: SHAPESHIFT_REDIRECT_URI
    });
    const url = `${SHAPESHIFT_AUTHORIZATION_URL}?${query}`;

    if (isDesktop()) {
      const { ipcRenderer } = (window as any).require('electron');

      ipcRenderer.send('shapeshift-authorize', url);
    } else {
      window.open(url, '_blank', 'width=800, height=600, menubar=yes');
    }
  }

  public clearCache = () => {
    this.cacheClear(SHAPESHIFT_ACCESS_TOKEN);
    this.cacheClear('validPairs');
    this.cacheClear('pairInfo');
    this.cacheClear('images');
    this.cacheClear('activeShift');
  };

  public authorize = (passedToken?: string) => {
    if (passedToken) {
      this.cacheSet({ [SHAPESHIFT_ACCESS_TOKEN]: passedToken });
      this.token = passedToken;
      this.updateService();
    } else {
      const wasAuthorized = this.isAuthorized();
      const token = this.cacheGet(SHAPESHIFT_ACCESS_TOKEN);

      if (token && !wasAuthorized) {
        this.authorize(token);
      } else if (!token && wasAuthorized) {
        this.deauthorize();
      }
    }
  };

  private async requestAccessToken(code: string) {
    const {
      data: { access_token: token }
    } = await this.service.post(SHAPESHIFT_TOKEN_PROXY_URL, {
      code,
      grant_type: 'authorization_code'
    });

    this.authorize(token);

    if (isDesktop()) {
      const { ipcRenderer } = (window as any).require('electron');

      ipcRenderer.send('shapeshift-token-retrieved', token);
    } else {
      (window as any).close();
    }
  }

  private updateService() {
    const headers = this.token
      ? {
          Authorization: `Bearer ${this.token}`
        }
      : {};

    this.service = APIService.generateInstance({
      baseURL: 'https://shapeshift.io',
      headers
    });
  }

  private deauthorize = () => {
    this.token = null;
    this.updateService();
  };
}

let instantiated = false;

// tslint:disable-next-line
export default class ShapeShiftService extends ShapeShiftServiceBase {
  public static instance = new ShapeShiftService();

  constructor() {
    super();

    if (instantiated) {
      throw new Error(`ShapeShiftService has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }
}

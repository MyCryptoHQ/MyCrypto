import { AxiosInstance } from 'axios';
import queryString from 'query-string';

import { logError, isDesktop } from 'v2/utils';
import { APIService } from '../API';
import { CacheService } from '../Cache';
import { StorageService } from '../Storage';
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

class ShapeShiftServiceBase {
  private token: string | null = null;
  private authorizationInterval: number | null = null;
  private deauthorizationInterval: number | null = null;
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

  public constructor() {
    const { code } = queryString.parse(window.location.search);

    code ? this.requestAccessToken(code) : this.authorize();

    StorageService.instance.listen(SHAPESHIFT_ACCESS_TOKEN, this.authorize, this.deauthorize);
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
      const { data: { status } } = await this.service.get(url);

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

  public isAuthorized(): boolean {
    return Boolean(this.token);
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

  public listenForAuthorization(callback: () => void) {
    this.authorizationInterval = setInterval(() => {
      if (this.isAuthorized()) {
        callback();
        this.stopListeningForAuthorization();
      }
    });
  }

  public stopListeningForAuthorization = () => clearInterval(this.authorizationInterval as number);

  public listenForDeauthorization(callback: () => void) {
    this.deauthorizationInterval = setInterval(() => {
      if (!this.isAuthorized()) {
        callback();
        this.stopListeningForDeauthorization();
      }
    });
  }

  public stopListeningForDeauthorization = () =>
    clearInterval(this.deauthorizationInterval as number);

  private async requestAccessToken(code: string) {
    const { data: { access_token: token } } = await this.service.post(SHAPESHIFT_TOKEN_PROXY_URL, {
      code,
      grant_type: 'authorization_code'
    });

    this.cacheSet(SHAPESHIFT_ACCESS_TOKEN, token);
    this.authorize(token);

    if (isDesktop()) {
      const { ipcRenderer } = (window as any).require('electron');

      ipcRenderer.send('shapeshift-token-retrieved', token);
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

  private authorize = (passedToken?: string) => {
    const token = passedToken || StorageService.instance.getEntry(SHAPESHIFT_ACCESS_TOKEN);

    if (token) {
      this.token = token;
      this.updateService();
    }
  };

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

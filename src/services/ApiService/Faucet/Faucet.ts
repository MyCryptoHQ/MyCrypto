import { AxiosInstance } from 'axios';

import { ApiService } from '@services/ApiService';

import { FAUCET_API_URL } from './constants';
import {
  FaucetChallengeResponse,
  FaucetErrorResponse,
  FaucetSolvedChallengeResponse
} from './types';

export default abstract class CryptoScamDBService {
  public static requestChallenge = async (network: string, address: string) => {
    const { data } = await CryptoScamDBService.service
      .get<FaucetErrorResponse | FaucetChallengeResponse>(`/challenge/${network}/${address}`)
      .catch();
    return data;
  };

  public static solveChallenge = async (id: string, solution: string) => {
    const { data } = await CryptoScamDBService.service
      .get<FaucetErrorResponse | FaucetSolvedChallengeResponse>(`/solve/${id}/${solution}`)
      .catch();
    return data;
  };

  public static regenerateChallenge = async (id: string) => {
    const { data } = await CryptoScamDBService.service
      .get<FaucetErrorResponse | FaucetChallengeResponse>(`/regenerate/${id}`)
      .catch();
    return data;
  };

  private static service: AxiosInstance = ApiService.generateInstance({
    baseURL: FAUCET_API_URL,
    timeout: 5000
  });
}

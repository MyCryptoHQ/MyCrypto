import { AxiosInstance } from 'axios';

import { FAUCET_API } from '@config';
import { ApiService } from '@services/ApiService';

import {
  FaucetChallengeResponse,
  FaucetErrorResponse,
  FaucetSolvedChallengeResponse
} from './types';

export default abstract class FaucetService {
  public static requestChallenge = async (network: string, address: string) => {
    const { data } = await FaucetService.service
      .get<FaucetErrorResponse | FaucetChallengeResponse>(`/challenge/${network}/${address}`)
      .catch();
    return data;
  };

  public static solveChallenge = async (id: string, solution: string) => {
    const { data } = await FaucetService.service
      .get<FaucetErrorResponse | FaucetSolvedChallengeResponse>(`/solve/${id}/${solution}`)
      .catch();
    return data;
  };

  public static regenerateChallenge = async (id: string) => {
    const { data } = await FaucetService.service
      .get<FaucetErrorResponse | FaucetChallengeResponse>(`/regenerate/${id}`)
      .catch();
    return data;
  };

  private static service: AxiosInstance = ApiService.generateInstance({
    baseURL: FAUCET_API,
    timeout: 5000
  });
}

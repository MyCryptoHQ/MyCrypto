import axios from 'axios';
import { StoreAccount } from '@types';
import { FAUCET_API } from '@config';

const api = axios.create({
  baseURL: FAUCET_API,
  validateStatus: () => true
});

const throwFailure = (message?: string) => {
  throw new Error(message);
};

const throwApiFailure = () => throwFailure('API_FAILURE');

export const possibleSolution = (solution: string) => {
  return /^[a-zA-Z0-9]{4}$/.test(solution);
};

export const requestChallenge = async (recipientAddress: StoreAccount) => {
  const network = recipientAddress.network.name.toLowerCase();
  const address = recipientAddress.address;
  const result = await api.get(`/challenge/${network}/${address}`).catch(throwApiFailure);

  if (result.status !== 200) {
    throwApiFailure();
  } else if (!result.data.success) {
    throwFailure(result.data.message);
  } else {
    return result.data.result;
  }
};

export const solveChallenge = async (id: string, solution: string) => {
  const result = await api.get(`/solve/${id}/${solution}`).catch(throwApiFailure);

  if (result.status !== 200) {
    throwApiFailure();
  } else if (!result.data.success) {
    throwFailure(result.data.message);
  } else {
    return result.data.result;
  }
};

export const regenerateChallenge = async (id: string) => {
  const result = await api.get(`/regenerate/${id}`).catch(throwApiFailure);

  if (result.status !== 200) {
    throwApiFailure();
  } else if (!result.data.success) {
    throwFailure(result.data.message);
  } else {
    return result.data.result;
  }
};

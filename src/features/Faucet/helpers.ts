import axios from 'axios';
import { StoreAccount } from '@types';

const FAUCET_API_URL = 'https://d3a0rurg7bu691.cloudfront.net';

const api = axios.create({
  baseURL: FAUCET_API_URL,
  validateStatus: () => true
});

const throwFailure = (message?: string) => {
  throw new Error(message);
};

const throwApiFailure = () => throwFailure('API_FAILURE');

export const possibleSolution = (solution: string) => {
  const numSolution = parseInt(solution, 10);
  if (isNaN(numSolution)) {
    return false;
  } else if (numSolution < -8 || numSolution > 18) {
    return false;
  } else {
    return true;
  }
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

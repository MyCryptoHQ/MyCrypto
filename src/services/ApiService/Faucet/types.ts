export interface FaucetResponse {
  success: boolean;
}

export interface FaucetErrorResponse extends FaucetResponse {
  message: string;
  success: false;
}

export interface FaucetChallengeResponse {
  success: true;
  result: {
    id: string;
    challenge: string;
  };
}

interface FaucetSolvedChallengeResponseV1 {
  success: true;
  result: {
    chainId: number;
    data: string;
    from: string;
    gasLimit: string;
    gasPrice: string;
    hash: string;
    network: string;
    nonce: number;
    to: string;
    value: string;
  };
}

interface FaucetSolvedChallengeResponseV2 {
  success: true;
  result: {
    chainId: number;
    data: string;
    from: string;
    gasLimit: string;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    hash: string;
    network: string;
    nonce: number;
    to: string;
    value: string;
  };
}

export type FaucetSolvedChallengeResponse =
  | FaucetSolvedChallengeResponseV1
  | FaucetSolvedChallengeResponseV2;

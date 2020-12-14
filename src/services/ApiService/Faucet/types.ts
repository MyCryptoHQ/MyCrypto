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

export interface FaucetSolvedChallengeResponse {
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

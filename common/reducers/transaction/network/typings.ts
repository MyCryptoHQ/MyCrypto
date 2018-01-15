export enum RequestStatus {
  REQUESTED = 'PENDING',
  SUCCEEDED = 'SUCCESS',
  FAILED = 'FAIL',
  TIMEOUT = 'TIMEOUT'
}
export interface State {
  gasEstimationStatus: RequestStatus | null;
  getFromStatus: RequestStatus | null;
  getNonceStatus: RequestStatus | null;
}

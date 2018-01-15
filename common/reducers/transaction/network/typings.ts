export enum RequestStatus {
  REQUESTED = 'PENDING',
  SUCCEEDED = 'SUCCESS',
  FAILED = 'FAIL',
  TIMEDOUT = 'TIMEDOUT'
}
export interface State {
  gasEstimationStatus: RequestStatus | null;
  getFromStatus: RequestStatus | null;
  getNonceStatus: RequestStatus | null;
}

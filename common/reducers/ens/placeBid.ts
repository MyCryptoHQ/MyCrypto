import { EnsAction, TypeKeys } from 'actions/ens';

export enum GenerationStage {
  WAITING_ON_USER_INPUT = 'WAITING_ON_USER_INPUT',
  ENCODING_BID_DATA = 'ENCODING_BID_DATA',
  READY_TO_GENERATE_TRANSACTION = 'READY_TO_GENERATE_TRANSACTION',
  FAILED = 'FAILED'
}

export interface State {
  bidGenerationStage: GenerationStage;
}

const INITIAL_STATE: State = {
  bidGenerationStage: GenerationStage.WAITING_ON_USER_INPUT
};

const handleBidPlaceRequested = (): State => ({
  bidGenerationStage: GenerationStage.ENCODING_BID_DATA
});

const handleBidPlaceSucceeded = (): State => ({
  bidGenerationStage: GenerationStage.READY_TO_GENERATE_TRANSACTION
});

const handleBidPlaceFailed = (): State => ({ bidGenerationStage: GenerationStage.FAILED });

const reset = (): State => INITIAL_STATE;

export default (state: State = INITIAL_STATE, action: EnsAction): State => {
  switch (action.type) {
    case TypeKeys.ENS_BID_PLACE_REQUESTED:
      return handleBidPlaceRequested();

    case TypeKeys.ENS_BID_PLACE_SUCCEEDED:
      return handleBidPlaceSucceeded();

    case TypeKeys.ENS_BID_PLACE_FAILED:
      return handleBidPlaceFailed();
    default:
      return state;
  }
};

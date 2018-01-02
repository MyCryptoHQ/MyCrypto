import { TypeKeys } from './constants';

export interface Pairs {
  ETHBTC: number;
  ETHREP: number;
  BTCETH: number;
  BTCREP: number;
}

export interface SwapInput {
  id: string;
  amount: number | string;
}

export interface SwapInputs {
  origin: SwapInput;
  destination: SwapInput;
}

export interface InitSwap {
  type: TypeKeys.SWAP_INIT;
  payload: SwapInputs;
}

export interface Option {
  id: string;
  status?: string;
  image?: string;
}

export interface ApiResponseObj {
  id: string;
  options: Option[];
  rate: number;
}

export interface ApiResponse {
  [name: string]: ApiResponseObj;
}

export interface LoadBityRatesSucceededSwapAction {
  type: TypeKeys.SWAP_LOAD_BITY_RATES_SUCCEEDED;
  payload: ApiResponse;
}

export interface LoadShapshiftRatesSucceededSwapAction {
  type: TypeKeys.SWAP_LOAD_SHAPESHIFT_RATES_SUCCEEDED;
  payload: ApiResponse;
}

export interface DestinationAddressSwapAction {
  type: TypeKeys.SWAP_DESTINATION_ADDRESS;
  payload?: string;
}

export interface RestartSwapAction {
  type: TypeKeys.SWAP_RESTART;
}

export interface LoadBityRatesRequestedSwapAction {
  type: TypeKeys.SWAP_LOAD_BITY_RATES_REQUESTED;
  payload?: null;
}

export interface LoadShapeshiftRequestedSwapAction {
  type: TypeKeys.SWAP_LOAD_SHAPESHIFT_RATES_REQUESTED;
  payload?: null;
}

export interface ChangeStepSwapAction {
  type: TypeKeys.SWAP_STEP;
  payload: number;
}

export interface StopLoadBityRatesSwapAction {
  type: TypeKeys.SWAP_STOP_LOAD_BITY_RATES;
}

export interface StopLoadShapeshiftRatesSwapAction {
  type: TypeKeys.SWAP_STOP_LOAD_SHAPESHIFT_RATES;
}

export interface OrderSwapTimeSwapAction {
  type: TypeKeys.SWAP_ORDER_TIME;
  payload: number;
}

export interface BityOrderCreateRequestedSwapAction {
  type: TypeKeys.SWAP_BITY_ORDER_CREATE_REQUESTED;
  payload: {
    amount: number;
    destinationAddress: string;
    pair: string;
    mode: number;
  };
}

export interface ShapeshiftOrderCreateRequestedSwapAction {
  type: TypeKeys.SWAP_SHAPESHIFT_ORDER_CREATE_REQUESTED;
  payload: {
    withdrawal: string;
    originKind: string;
    destinationKind: string;
    destinationAmount: number;
  };
}

export interface BityOrderInput {
  amount: string;
  currency: string;
  reference: string;
  status: string;
}

export interface BityOrderOutput {
  amount: string;
  currency: string;
  reference: string;
  status: string;
}

export interface BityOrderResponse {
  input: BityOrderInput;
  output: BityOrderOutput;
  status: string;
}

export interface ShapeshiftOrderResponse {
  apiPubKey?: string;
  deposit: string;
  depositAmount: string;
  expiration: number;
  expirationFormatted?: string;
  inputCurrency?: string;
  maxLimit: number;
  minerFee: string;
  orderId: string;
  outputCurrency?: string;
  pair: string; // e.g. eth_bat
  provider?: ProviderName; // shapeshift
  quotedRate: string;
  withdrawal: string;
  withdrawalAmount: string;
}

export interface ShapeshiftStatusResponse {
  status: string;
  address?: string;
  withdraw?: string;
  transaction: string;
}

export type BityOrderPostResponse = BityOrderResponse & {
  payment_address: string;
  status: string;
  input: BityOrderInput;
  output: BityOrderOutput;
  timestamp_created: string;
  validFor: number;
  id: string;
};

export type ProviderName = 'shapeshift' | 'bity';

export interface BityOrderCreateSucceededSwapAction {
  type: TypeKeys.SWAP_BITY_ORDER_CREATE_SUCCEEDED;
  payload: BityOrderPostResponse;
}

export interface ShapeshiftOrderCreateSucceededSwapAction {
  type: TypeKeys.SWAP_SHAPESHIFT_ORDER_CREATE_SUCCEEDED;
  payload: ShapeshiftOrderResponse;
}

export interface BityOrderCreateFailedSwapAction {
  type: TypeKeys.SWAP_BITY_ORDER_CREATE_FAILED;
}

export interface ShapeshiftOrderCreateFailedSwapAction {
  type: TypeKeys.SWAP_SHAPESHIFT_ORDER_CREATE_FAILED;
}

export interface BityOrderStatusRequestedSwapAction {
  type: TypeKeys.SWAP_BITY_ORDER_STATUS_REQUESTED;
}

export interface ShapeshiftOrderStatusRequestedSwapAction {
  type: TypeKeys.SWAP_SHAPESHIFT_ORDER_STATUS_REQUESTED;
}

export interface BityOrderStatusSucceededSwapAction {
  type: TypeKeys.SWAP_BITY_ORDER_STATUS_SUCCEEDED;
  payload: BityOrderResponse;
}

export interface ShapeshiftOrderStatusSucceededSwapAction {
  type: TypeKeys.SWAP_SHAPESHIFT_ORDER_STATUS_SUCCEEDED;
  payload: ShapeshiftStatusResponse;
}

export interface StartOrderTimerSwapAction {
  type: TypeKeys.SWAP_ORDER_START_TIMER;
}

export interface StopOrderTimerSwapAction {
  type: TypeKeys.SWAP_ORDER_STOP_TIMER;
}

export interface StartPollBityOrderStatusAction {
  type: TypeKeys.SWAP_START_POLL_BITY_ORDER_STATUS;
}

export interface StartPollShapeshiftOrderStatusAction {
  type: TypeKeys.SWAP_START_POLL_SHAPESHIFT_ORDER_STATUS;
}

export interface StopPollBityOrderStatusAction {
  type: TypeKeys.SWAP_STOP_POLL_BITY_ORDER_STATUS;
}

export interface StopPollShapeshiftOrderStatusAction {
  type: TypeKeys.SWAP_STOP_POLL_SHAPESHIFT_ORDER_STATUS;
}

export interface ChangeProviderSwapAcion {
  type: TypeKeys.SWAP_CHANGE_PROVIDER;
  payload: ProviderName;
}

export interface ConfigureLiteSendAction {
  type: TypeKeys.SWAP_CONFIGURE_LITE_SEND;
}

export interface ShowLiteSendAction {
  type: TypeKeys.SWAP_SHOW_LITE_SEND;
  payload: boolean;
}

/*** Action Type Union ***/
export type SwapAction =
  | ChangeStepSwapAction
  | InitSwap
  | LoadBityRatesSucceededSwapAction
  | LoadShapshiftRatesSucceededSwapAction
  | DestinationAddressSwapAction
  | RestartSwapAction
  | LoadBityRatesRequestedSwapAction
  | LoadShapeshiftRequestedSwapAction
  | StopLoadBityRatesSwapAction
  | StopLoadShapeshiftRatesSwapAction
  | BityOrderCreateRequestedSwapAction
  | ShapeshiftOrderCreateRequestedSwapAction
  | BityOrderCreateSucceededSwapAction
  | ShapeshiftOrderCreateSucceededSwapAction
  | BityOrderStatusSucceededSwapAction
  | ShapeshiftOrderStatusSucceededSwapAction
  | StartPollBityOrderStatusAction
  | StartPollShapeshiftOrderStatusAction
  | BityOrderCreateFailedSwapAction
  | ShapeshiftOrderCreateFailedSwapAction
  | OrderSwapTimeSwapAction
  | ChangeProviderSwapAcion
  | ConfigureLiteSendAction
  | ShowLiteSendAction;

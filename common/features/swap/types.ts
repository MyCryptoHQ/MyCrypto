import { WhitelistedCoins } from 'config';

export interface SwapState {
  step: number;
  origin: WhitelistedSwapInput;
  destination: WhitelistedSwapInput;
  options: NormalizedOptions;
  bityRates: NormalizedBityRates;
  // Change this
  shapeshiftRates: NormalizedShapeshiftRates;
  provider: ProviderName;
  bityOrder: any;
  shapeshiftOrder: any;
  destinationAddress: string;
  isFetchingRates: boolean | null;
  hasNotifiedRatesFailure: boolean;
  secondsRemaining: number | null;
  outputTx: string | null;
  isPostingOrder: boolean;
  bityOrderStatus: string | null;
  shapeshiftOrderStatus: string | null;
  orderTimestampCreatedISOString: string | null;
  paymentAddress: string | null;
  validFor: number | null;
  orderId: string | null;
  showLiteSend: boolean;
}

export enum SwapActions {
  STEP = 'SWAP_STEP',
  INIT = 'SWAP_INIT',
  LOAD_BITY_RATES_SUCCEEDED = 'SWAP_LOAD_BITY_RATES_SUCCEEDED',
  LOAD_SHAPESHIFT_RATES_SUCCEEDED = 'SWAP_LOAD_SHAPESHIFT_RATES_SUCCEEDED',
  DESTINATION_ADDRESS = 'SWAP_DESTINATION_ADDRESS',
  RESTART = 'SWAP_RESTART',
  LOAD_BITY_RATES_REQUESTED = 'SWAP_LOAD_BITY_RATES_REQUESTED',
  LOAD_SHAPESHIFT_RATES_REQUESTED = 'SWAP_LOAD_SHAPESHIFT_RATES_REQUESTED',
  LOAD_BITY_RATES_FAILED = 'SWAP_LOAD_BITY_RATES_FAILED',
  LOAD_SHAPESHIFT_RATES_FAILED = 'SWAP_LOAD_SHAPESHIFT_RATES_FAILED',
  STOP_LOAD_BITY_RATES = 'SWAP_STOP_LOAD_BITY_RATES',
  STOP_LOAD_SHAPESHIFT_RATES = 'SWAP_STOP_LOAD_SHAPESHIFT_RATES',
  ORDER_TIME = 'SWAP_ORDER_TIME',
  BITY_ORDER_CREATE_SUCCEEDED = 'SWAP_BITY_ORDER_CREATE_SUCCEEDED',
  SHAPESHIFT_ORDER_CREATE_SUCCEEDED = 'SWAP_SHAPESHIFT_ORDER_CREATE_SUCCEEDED',
  BITY_ORDER_STATUS_SUCCEEDED = 'SWAP_BITY_ORDER_STATUS_SUCCEEDED',
  SHAPESHIFT_ORDER_STATUS_SUCCEEDED = 'SWAP_SHAPESHIFT_ORDER_STATUS_SUCCEEDED',
  BITY_ORDER_STATUS_REQUESTED = 'SWAP_BITY_ORDER_STATUS_REQUESTED',
  SHAPESHIFT_ORDER_STATUS_REQUESTED = 'SWAP_SHAPESHIFT_ORDER_STATUS_REQUESTED',
  ORDER_START_TIMER = 'SWAP_ORDER_START_TIMER',
  ORDER_STOP_TIMER = 'SWAP_ORDER_STOP_TIMER',
  START_POLL_BITY_ORDER_STATUS = 'SWAP_START_POLL_BITY_ORDER_STATUS',
  START_POLL_SHAPESHIFT_ORDER_STATUS = 'SWAP_START_POLL_SHAPESHIFT_ORDER_STATUS',
  STOP_POLL_BITY_ORDER_STATUS = 'SWAP_STOP_POLL_BITY_ORDER_STATUS',
  STOP_POLL_SHAPESHIFT_ORDER_STATUS = 'SWAP_STOP_POLL_SHAPESHIFT_ORDER_STATUS',
  BITY_ORDER_CREATE_REQUESTED = 'SWAP_ORDER_CREATE_REQUESTED',
  SHAPESHIFT_ORDER_CREATE_REQUESTED = 'SWAP_SHAPESHIFT_ORDER_CREATE_REQUESTED',
  BITY_ORDER_CREATE_FAILED = 'SWAP_ORDER_CREATE_FAILED',
  SHAPESHIFT_ORDER_CREATE_FAILED = 'SWAP_SHAPESHIFT_ORDER_CREATE_FAILED',
  CHANGE_PROVIDER = 'SWAP_CHANGE_PROVIDER',
  CONFIGURE_LITE_SEND = 'SWAP_CONFIGURE_LITE_SEND',
  SHOW_LITE_SEND = 'SWAP_SHOW_LITE_SEND'
}

export interface Pairs {
  ETHBTC: number;
  ETHREP: number;
  BTCETH: number;
  BTCREP: number;
}

export interface SwapInput {
  label: WhitelistedCoins;
  amount: number | string;
}

export interface SwapInputs {
  origin: SwapInput;
  destination: SwapInput;
}

export interface InitSwap {
  type: SwapActions.INIT;
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
  type: SwapActions.LOAD_BITY_RATES_SUCCEEDED;
  payload: ApiResponse;
}

export interface LoadShapeshiftRatesSucceededSwapAction {
  type: SwapActions.LOAD_SHAPESHIFT_RATES_SUCCEEDED;
  payload: ApiResponse;
}

export interface DestinationAddressSwapAction {
  type: SwapActions.DESTINATION_ADDRESS;
  payload?: string;
}

export interface RestartSwapAction {
  type: SwapActions.RESTART;
}

export interface LoadBityRatesRequestedSwapAction {
  type: SwapActions.LOAD_BITY_RATES_REQUESTED;
}

export interface LoadShapeshiftRatesRequestedSwapAction {
  type: SwapActions.LOAD_SHAPESHIFT_RATES_REQUESTED;
}

export interface LoadBityRatesFailedSwapAction {
  type: SwapActions.LOAD_BITY_RATES_FAILED;
}

export interface LoadShapeshiftRatesFailedSwapAction {
  type: SwapActions.LOAD_SHAPESHIFT_RATES_FAILED;
}

export interface ChangeStepSwapAction {
  type: SwapActions.STEP;
  payload: number;
}

export interface StopLoadBityRatesSwapAction {
  type: SwapActions.STOP_LOAD_BITY_RATES;
}

export interface StopLoadShapeshiftRatesSwapAction {
  type: SwapActions.STOP_LOAD_SHAPESHIFT_RATES;
}

export interface OrderSwapTimeSwapAction {
  type: SwapActions.ORDER_TIME;
  payload: number;
}

export interface BityOrderCreateRequestedSwapAction {
  type: SwapActions.BITY_ORDER_CREATE_REQUESTED;
  payload: {
    amount: number;
    destinationAddress: string;
    pair: string;
    mode: number;
  };
}

export interface ShapeshiftOrderCreateRequestedSwapAction {
  type: SwapActions.SHAPESHIFT_ORDER_CREATE_REQUESTED;
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
  type: SwapActions.BITY_ORDER_CREATE_SUCCEEDED;
  payload: BityOrderPostResponse;
}

export interface ShapeshiftOrderCreateSucceededSwapAction {
  type: SwapActions.SHAPESHIFT_ORDER_CREATE_SUCCEEDED;
  payload: ShapeshiftOrderResponse;
}

export interface BityOrderCreateFailedSwapAction {
  type: SwapActions.BITY_ORDER_CREATE_FAILED;
}

export interface ShapeshiftOrderCreateFailedSwapAction {
  type: SwapActions.SHAPESHIFT_ORDER_CREATE_FAILED;
}

export interface BityOrderStatusRequestedSwapAction {
  type: SwapActions.BITY_ORDER_STATUS_REQUESTED;
}

export interface ShapeshiftOrderStatusRequestedSwapAction {
  type: SwapActions.SHAPESHIFT_ORDER_STATUS_REQUESTED;
}

export interface BityOrderStatusSucceededSwapAction {
  type: SwapActions.BITY_ORDER_STATUS_SUCCEEDED;
  payload: BityOrderResponse;
}

export interface ShapeshiftOrderStatusSucceededSwapAction {
  type: SwapActions.SHAPESHIFT_ORDER_STATUS_SUCCEEDED;
  payload: ShapeshiftStatusResponse;
}

export interface StartOrderTimerSwapAction {
  type: SwapActions.ORDER_START_TIMER;
}

export interface StopOrderTimerSwapAction {
  type: SwapActions.ORDER_STOP_TIMER;
}

export interface StartPollBityOrderStatusAction {
  type: SwapActions.START_POLL_BITY_ORDER_STATUS;
}

export interface StartPollShapeshiftOrderStatusAction {
  type: SwapActions.START_POLL_SHAPESHIFT_ORDER_STATUS;
}

export interface StopPollBityOrderStatusAction {
  type: SwapActions.STOP_POLL_BITY_ORDER_STATUS;
}

export interface StopPollShapeshiftOrderStatusAction {
  type: SwapActions.STOP_POLL_SHAPESHIFT_ORDER_STATUS;
}

export interface ChangeProviderSwapAcion {
  type: SwapActions.CHANGE_PROVIDER;
  payload: ProviderName;
}

export interface ConfigureLiteSendAction {
  type: SwapActions.CONFIGURE_LITE_SEND;
}

export interface ShowLiteSendAction {
  type: SwapActions.SHOW_LITE_SEND;
  payload: boolean;
}

export type SwapAction =
  | ChangeStepSwapAction
  | InitSwap
  | DestinationAddressSwapAction
  | RestartSwapAction
  | LoadBityRatesRequestedSwapAction
  | LoadBityRatesSucceededSwapAction
  | LoadBityRatesFailedSwapAction
  | LoadShapeshiftRatesRequestedSwapAction
  | LoadShapeshiftRatesSucceededSwapAction
  | LoadShapeshiftRatesFailedSwapAction
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

//#region State Types
export interface WhitelistedSwapInput {
  label: WhitelistedCoins;
  amount: number | string;
}

export interface NormalizedRate {
  id: number;
  options: WhitelistedCoins[];
  rate: number;
}

export interface NormalizedRates {
  byId: { [id: string]: NormalizedRate };
  allIds: string[];
}

export interface NormalizedBityRate extends NormalizedRate {
  id: number;
  options: WhitelistedCoins[];
  rate: number;
}

export interface NormalizedBityRates {
  byId: { [id: string]: NormalizedBityRate };
  allIds: string[];
}

export interface NormalizedShapeshiftRate extends NormalizedRate {
  id: number;
  options: WhitelistedCoins[];
  rate: number;
  limit: number;
  min: number;
}

export interface NormalizedShapeshiftRates {
  byId: { [id: string]: NormalizedShapeshiftRate };
  allIds: string[];
}

export interface NormalizedOptions {
  byId: { [id: string]: Option };
  allIds: string[];
}
//#endregion State Types

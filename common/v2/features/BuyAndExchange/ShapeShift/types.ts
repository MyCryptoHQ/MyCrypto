import { SendAmountResponse } from 'v2/services';

export interface AssetOption {
  logo: string;
  ticker: string;
  name: string;
}

export interface ShapeShiftSendRenderProps {
  sendField: any;
  addressField: any;
  timeField: any;
  receiveAmountField: any;
  rateField: any;
  referenceNumberField: any;
  statusField: any;
  transaction: SendAmountResponse;
}

export interface ShapeShiftStrategies {
  [ticker: string]: {
    generateSendScreenLayout(props: ShapeShiftSendRenderProps): any;
  };
}

import { TUseStateReducerFactory } from 'v2/utils';
import { ZapInteractionState } from './types';
import { IZapConfig } from './config';

const ZapInteractionFactory: TUseStateReducerFactory<ZapInteractionState> = ({
  state,
  setState
}) => {
  const handleZapSelection = (zapSelected: IZapConfig) => {
    setState({
      ...state,
      zapSelected
    });
  };

  return {
    handleZapSelection,
    zapFlowState: state
  };
};

export default ZapInteractionFactory;

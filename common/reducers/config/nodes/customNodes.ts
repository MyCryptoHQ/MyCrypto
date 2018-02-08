import {
  TypeKeys,
  CustomNodeAction,
  AddCustomNodeAction,
  RemoveCustomNodeAction
} from 'actions/config';
import { CustomNodeConfig } from 'types/node';

export interface State {
  [customNodeId: string]: CustomNodeConfig;
}

const addCustomNode = (state: State, { payload }: AddCustomNodeAction): State => ({
  ...state,
  [payload.id]: payload.config
});

function removeCustomNode(state: State, { payload }: RemoveCustomNodeAction): State {
  const stateCopy = { ...state };
  Reflect.deleteProperty(stateCopy, payload.id);
  return stateCopy;
}

export const customNodes = (state: State = {}, action: CustomNodeAction): State => {
  switch (action.type) {
    case TypeKeys.CONFIG_ADD_CUSTOM_NODE:
      return addCustomNode(state, action);
    case TypeKeys.CONFIG_REMOVE_CUSTOM_NODE:
      return removeCustomNode(state, action);
    default:
      return state;
  }
};

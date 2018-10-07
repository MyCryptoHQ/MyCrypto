import * as types from './types';

const INITIAL_STATE: types.SidebarState = {
  visible: false,
  screen: 'selectNetworkAndNode'
};

export function sidebarReducer(
  state: types.SidebarState = INITIAL_STATE,
  action: types.SidebarAction
) {
  switch (action.type) {
    case types.SidebarActions.TOGGLE: {
      const { visible: previouslyVisible } = state;
      const { payload: screen } = action;

      return { ...state, visible: !previouslyVisible, screen };
    }
    case types.SidebarActions.OPEN: {
      const { payload: screen } = action;

      return { ...state, visible: true, screen };
    }
    case types.SidebarActions.CLOSE:
      return { ...state, visible: false };
    default:
      return state;
  }
}

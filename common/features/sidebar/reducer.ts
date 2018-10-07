import * as types from './types';

const INITIAL_STATE: types.SidebarState = {
  visible: false
};

export function sidebarReducer(
  state: types.SidebarState = INITIAL_STATE,
  action: types.SidebarAction
) {
  switch (action.type) {
    case types.SidebarActions.TOGGLE:
      const { visible: previouslyVisible } = state;
      return { ...state, visible: !previouslyVisible };
    case types.SidebarActions.OPEN:
      return { ...state, visible: true };
    case types.SidebarActions.CLOSE:
      return { ...state, visible: false };
    default:
      return state;
  }
}

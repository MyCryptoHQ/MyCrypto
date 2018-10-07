import * as types from './types';

export type TToggleSidebar = typeof toggleSidebar;
export const toggleSidebar = (screen: types.SidebarScreen): types.ToggleSidebarAction => ({
  type: types.SidebarActions.TOGGLE,
  payload: screen
});

export type TOpenSidebar = typeof openSidebar;
export const openSidebar = (screen: types.SidebarScreen): types.OpenSidebarAction => ({
  type: types.SidebarActions.OPEN,
  payload: screen
});

export type TCloseSidebar = typeof closeSidebar;
export const closeSidebar = (): types.CloseSidebarAction => ({
  type: types.SidebarActions.CLOSE
});

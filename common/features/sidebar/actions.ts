import * as types from './types';

export type TToggleSidebar = typeof toggleSidebar;
export const toggleSidebar = (): types.ToggleSidebarAction => ({
  type: types.SidebarActions.TOGGLE
});

export type TCloseSidebar = typeof closeSidebar;
export const closeSidebar = (): types.CloseSidebarAction => ({
  type: types.SidebarActions.CLOSE
});

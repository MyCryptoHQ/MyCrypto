export interface SidebarState {
  visible: boolean;
  screen: SidebarScreen;
}

export enum SidebarActions {
  TOGGLE = 'SIDEBAR_TOGGLE',
  OPEN = 'SIDEBAR_OPEN',
  CLOSE = 'SIDEBAR_CLOSE'
}

export type SidebarScreen = 'selectNetworkAndNode' | 'selectLanguage';

export interface ToggleSidebarAction {
  type: SidebarActions.TOGGLE;
  payload: SidebarScreen;
}

export interface OpenSidebarAction {
  type: SidebarActions.OPEN;
  payload: SidebarScreen;
}

export interface CloseSidebarAction {
  type: SidebarActions.CLOSE;
}

export type SidebarAction = ToggleSidebarAction | OpenSidebarAction | CloseSidebarAction;

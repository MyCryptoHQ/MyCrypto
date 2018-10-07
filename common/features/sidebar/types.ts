export interface SidebarState {
  visible: boolean;
}

export enum SidebarActions {
  TOGGLE = 'SIDEBAR_TOGGLE',
  OPEN = 'SIDEBAR_OPEN',
  CLOSE = 'SIDEBAR_CLOSE'
}

export interface ToggleSidebarAction {
  type: SidebarActions.TOGGLE;
}

export interface OpenSidebarAction {
  type: SidebarActions.OPEN;
}

export interface CloseSidebarAction {
  type: SidebarActions.CLOSE;
}

export type SidebarAction = ToggleSidebarAction | OpenSidebarAction | CloseSidebarAction;

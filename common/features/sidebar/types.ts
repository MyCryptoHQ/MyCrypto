export interface SidebarState {
  visible: boolean;
}

export enum SidebarActions {
  TOGGLE = 'SIDEBAR_TOGGLE',
  CLOSE = 'SIDEBAR_CLOSE'
}

export interface ToggleSidebarAction {
  type: SidebarActions.TOGGLE;
}

export interface CloseSidebarAction {
  type: SidebarActions.CLOSE;
}

export type SidebarAction = ToggleSidebarAction | CloseSidebarAction;

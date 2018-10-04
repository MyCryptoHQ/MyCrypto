import { AppState } from 'features/reducers';

export const getSidebar = (state: AppState) => state.sidebar;
export const getSidebarVisible = (state: AppState) => getSidebar(state).visible;

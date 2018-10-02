import { AppState } from 'features/reducers';

export const getOnboarding = (state: AppState) => state.onboarding;
export const getActive = (state: AppState) => getOnboarding(state).active;
export const getSlide = (state: AppState) => getOnboarding(state).slide;

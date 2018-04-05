// Moving state types into their own file resolves an annoying webpack bug
// https://github.com/angular/angular-cli/issues/2034
import { StaticNetworkIds, StaticNetworkConfig, CustomNetworkConfig } from 'types/network';

export type StaticNetworksState = { [key in StaticNetworkIds]: StaticNetworkConfig };

// TODO: this doesn't accurately represent custom networks state
export interface CustomNetworksState {
  [customNetworkId: string]: CustomNetworkConfig;
}

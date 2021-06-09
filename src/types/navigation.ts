import { TIcon } from '@components';
import { IAppRoutes } from '@routing/routes';

import { TURL } from './url';

export interface INavigationProps {
  appRoutes: IAppRoutes;
  current: string;
}

export interface IRouteLink {
  type: 'internal';
  title: string;
  to: string;
  enabled: boolean;
  icon: TIcon;
}

export interface IExternalLink {
  type: 'external';
  title: string;
  link: TURL;
  icon: TIcon;
}

export type TTrayItem = IRouteLink | IExternalLink;

export interface INavTray {
  type: 'tray';
  title: string;
  enabled: boolean;
  icon: TIcon;
  items: TTrayItem[];
}

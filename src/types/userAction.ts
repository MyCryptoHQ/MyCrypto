import { ReactNode } from 'react';

import { TIcon } from '@components';
import { State as StoreContextState } from '@services/Store/StoreProvider';

import { TUuid } from './uuid';

export enum ACTION_CATEGORIES {
  SECURITY = 'security',
  SELF_LOVE = 'selfLove',
  MYC_EXPERIENCE = 'mycExperience',
  MIGRATION = 'migration',
  THIRD_PARTY = 'thirdParty'
}

export enum ACTION_STATE {
  DEFAULT = 'default',
  NEW = 'new',
  STARTED = 'started',
  COMPLETED = 'completed'
}

export interface ActionTemplate {
  name: string;
  icon: TIcon;
  heading: string;
  subHeading?(props: Record<string, any>): JSX.Element;
  body?: ReactNode[];
  priority: number;
  Component?(props: Record<string, any>): JSX.Element;
  props?: Record<string, unknown>;
  filter?(state: StoreContextState): boolean;
  button: {
    content: string;
    to: string;
    external: boolean;
  };
  category: ACTION_CATEGORIES;
}

export interface UserAction {
  name: string;
  state: ACTION_STATE;
}

export interface ExtendedUserAction extends UserAction {
  uuid: TUuid;
}

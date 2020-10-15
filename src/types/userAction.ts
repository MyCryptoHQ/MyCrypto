import { ReactNode } from 'react';

import { TIcon } from '@components';

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
  icon?: TIcon;
  heading: string;
  subHeading?: string;
  body: ReactNode[];
  priority: number;
  component?(): ReactNode;
  shouldDisplay?: boolean;
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

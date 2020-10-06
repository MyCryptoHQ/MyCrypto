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

export interface ActionTemplate {
  name: string;
  icon?: TIcon;
  heading: string;
  subHeading?: string;
  body: string[];
  priority: number;
  component?(): ReactNode;
  shouldDisplay(): boolean;
  button: {
    content: string;
    to: string;
    external: boolean;
  };
  category: ACTION_CATEGORIES;
}

export interface UserAction {
  name: string;
  state: 'default' | 'new' | 'started' | 'completed';
}

export interface ExtendedUserAction extends UserAction {
  uuid: TUuid;
}

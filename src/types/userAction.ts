import { ReactNode } from 'react';

import { TIcon } from '@components';
import { State as StoreContextState } from '@services/Store/StoreProvider';

import { TUuid } from './uuid';

export enum ACTION_NAME {
  UPDATE_LABEL = 'update_label',
  MIGRATE_REP = 'migrate_rep',
  CLAIM_UNI = 'claim_uni',
  RENEW_ENS = 'renew_ens',
  BUY_HW = 'buy_hw',
  MYC_MEMBERSHIP = 'myc_membership',
  ADD_ACCOUNT = 'add_account',
  BACKUP = 'backup',
  FEEDBACK = 'feedback',
  NEWSLETTER = 'newsletter',
  TELEGRAM = 'telegram',
  SWAP = 'swap',
  TWITTER = 'twitter',
  MIGRATE_LEND = 'migrate_lend'
}

export enum ACTION_CATEGORIES {
  SECURITY = 'security',
  SELF_LOVE = 'selfLove',
  MYC_EXPERIENCE = 'mycExperience',
  MIGRATION = 'migration',
  THIRD_PARTY = 'thirdParty',
  OTHER = 'OTHER'
}

export enum ACTION_STATE {
  DEFAULT = 'default',
  NEW = 'new',
  STARTED = 'started',
  COMPLETED = 'completed'
}

export interface ActionTemplate {
  name: ACTION_NAME;
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
    shouldComplete?: boolean;
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

import { ReactNode } from 'react';

import { ActionButtonProps, TIcon } from '@components';

import { StoreAccount } from './account';
import { StoreAsset } from './asset';
import { ClaimResult, ClaimType } from './claims';
import { DomainNameRecord } from './ens';
import { TUuid } from './uuid';

export enum ACTION_NAME {
  UPDATE_LABEL = 'update_label',
  MIGRATE_REP = 'migrate_rep',
  MIGRATE_ANT = 'migrate_ant',
  CLAIM_UNI = 'claim_uni',
  CLAIM_DAPPNODE = 'claim_dappnode',
  CLAIM_ENS = 'claim_ens',
  CLAIM_GIV = 'claim_giv',
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
  MIGRATE_LEND = 'migrate_lend',
  MIGRATE_GOL = 'migrate_gol',
  TESTNET_FAUCET = 'testnet_faucet'
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
  VIEWED = 'viewed',
  STARTED = 'started',
  COMPLETED = 'completed',
  HIDDEN = 'hidden'
}

export interface ActionFilters {
  assets: StoreAsset[];
  claims: Partial<Record<ClaimType, ClaimResult[]>>;
  ensOwnershipRecords: DomainNameRecord[];
  accounts: StoreAccount[];
  isMyCryptoMember: boolean;
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
  filter?(filters: ActionFilters): boolean | undefined;
  time?: {
    start: Date;
    end: Date;
  };
  button: {
    component(props: ActionButtonProps): JSX.Element;
    props: Omit<ActionButtonProps, 'userAction'>;
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

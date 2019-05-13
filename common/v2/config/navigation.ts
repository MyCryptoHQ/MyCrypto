import { knowledgeBaseURL } from './data';

export interface NavigationLink {
  name: string;
  to: string;
  external?: boolean;
  disabled?: boolean;
}

export const navigationLinks: NavigationLink[] = [
  {
    name: 'NAV_VIEW',
    to: '/account'
  },
  {
    name: 'NAV_GENERATEWALLET',
    to: '/generate'
  },
  {
    name: 'NAV_SWAP',
    to: '/swap'
  },
  {
    name: 'NAV_CONTRACTS',
    to: '/contracts'
  },
  {
    name: 'NAV_ENS',
    to: '/ens'
  },
  {
    name: 'NAV_SIGN',
    to: '/sign-and-verify-message'
  },
  {
    name: 'NAV_TXSTATUS',
    to: '/tx-status'
  },
  {
    name: 'NAV_BROADCAST',
    to: '/pushTx'
  },
  {
    name: 'NAV_SUPPORT_US',
    to: '/support-us',
    disabled: !process.env.BUILD_ELECTRON
  },
  {
    name: 'NAV_HELP',
    to: knowledgeBaseURL,
    external: true
  }
].filter(link => !link.disabled);

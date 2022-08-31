import { ROUTE_PATHS } from '@config';

import SignMessage from './SignMessage';
import VerifyMessage from './VerifyMessage';

export const tabsConfig = [
  {
    key: ROUTE_PATHS.SIGN_MESSAGE.name,
    subtitle: 'SIGN_MESSAGE_DESCRIPTION',
    component: SignMessage
  },
  {
    key: ROUTE_PATHS.VERIFY_MESSAGE.name,
    subtitle: 'VERIFY_MESSAGE_DESCRIPTION',
    component: VerifyMessage
  }
];

import { ComponentType } from 'react';

import { IS_ELECTRON } from '@utils';

export const requiresDesktopApp = (component: ComponentType) => (
  redirectComponent: ComponentType
): ComponentType => (IS_ELECTRON ? component : redirectComponent);

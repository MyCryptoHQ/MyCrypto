import { ComponentType } from 'react';

import { isDesktop } from 'utils';

export const requiresDesktopApp = (component: ComponentType) => (
  redirectComponent: ComponentType
): ComponentType => (isDesktop() ? component : redirectComponent);

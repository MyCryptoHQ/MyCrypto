import { ComponentType } from 'react';

import { isDesktop } from 'v2/utils';

export const requiresDesktopApp = (component: ComponentType) => (
  redirectComponent: ComponentType
): ComponentType => (isDesktop() ? component : redirectComponent);

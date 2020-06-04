export type IconSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';

export const deriveIconSize = (size: IconSize = 'base') => {
  switch (size) {
    case 'xs':
      return '8';
    case 'sm':
      return '12';
    default:
    case 'base':
      return '16';
    case 'lg':
      return '20';
    case 'xl':
      return '24';
  }
};

import { ZEROEX_CONTAINER_ID } from './constants';

export const replaceZeroExContainer = (): void => {
  const originalContainer = document.querySelector('.zeroExInstantMainContainer');

  if (originalContainer) {
    const wrapper = document.getElementById(ZEROEX_CONTAINER_ID);
    const grandparent = originalContainer.parentNode!.parentNode;

    wrapper!.appendChild(originalContainer);

    (grandparent as any).remove();
  }
};

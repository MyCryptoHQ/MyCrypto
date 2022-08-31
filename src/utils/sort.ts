import { compose, prop, sortBy, toLower } from '@vendor';

export const sortByLabel = sortBy(compose(toLower, prop('label')));

export const sortByTicker = sortBy(compose(toLower, prop('ticker')));

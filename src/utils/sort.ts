import { sortBy, compose, toLower, prop } from '@vendor';

export const sortByLabel = sortBy(compose(toLower, prop('label')));

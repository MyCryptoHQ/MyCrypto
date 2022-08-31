import { either, isEmpty, isNil } from '@vendor';

/**
 * Identify undefined, null and empty iterables.
 * gh: https://github.com/ramda/ramda/issues/2507
 */
export const isVoid = either(isNil, isEmpty);

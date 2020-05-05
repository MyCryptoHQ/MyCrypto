import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import xorWith from 'lodash/xorWith';

// DeepCompare array of objects.
// https://stackoverflow.com/a/37066038/2057532
export const isArrayEqual = (x: any[], y: any[]): boolean => isEmpty(xorWith(x, y, isEqual));

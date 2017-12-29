/**
 * Control flow functions.
 */
/* tslint:disable:no-increment-decrement */
export namespace Utils {
  /**
   * Logical 'any' or 'exists' function.
   */
  export function exists<T>(list: ReadonlyArray<T>, predicate: (t: T) => boolean): boolean {
    if (list != null) {
      for (let i = 0; i < list.length; i++) {
        const obj: T = list[i];
        if (predicate(obj)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * A contains function.
   */
  export function contains<T>(list: ReadonlyArray<T>, element: T): boolean {
    return exists(list, (item: T): boolean => {
      return item === element;
    });
  }

  /**
   * A removeAll function.
   */
  export function removeAll<T>(source: ReadonlyArray<T>, elementsToRemove: ReadonlyArray<T>): T[] {
    if (source == null || source.length === 0) {
      return [];
    }
    if (elementsToRemove == null || elementsToRemove.length === 0) {
      return [].concat(source); // be sure to return a copy of the array
    }

    return source.filter((sourceElement: T): boolean => {
      return !contains(elementsToRemove, sourceElement);
    });
  }

  /**
   * A remove() function.
   */
  export function remove<T>(source: ReadonlyArray<T>, elementToRemove: T): T[] {
    return removeAll(source, [elementToRemove]);
  }

  export function trimTo(source: string, maxLength: number): string {
    if (source == null) {
      return '';
    }
    if (source.length <= maxLength) {
      return source;
    }
    return source.substr(0, maxLength - 2) + '...';
  }
}
/* tslint:enable:no-increment-decrement */

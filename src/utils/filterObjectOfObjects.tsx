type TFilterObjectOfObjects = (object: TObject) => (predicate: any) => TObject;
type TFilter = ([key, value]: [any, any]) => boolean;

export const filterObjectOfObjects: TFilterObjectOfObjects = (object) => (predicate) => {
  const filter: TFilter =
    typeof predicate === 'function'
      ? ([, value]) => predicate(value)
      : ([, value]) => value[predicate];

  return Object.entries(object)
    .filter(filter)
    .reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: value
      };
    }, {});
};

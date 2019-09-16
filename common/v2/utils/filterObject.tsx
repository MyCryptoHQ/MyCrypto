export const filterObject = (object: any) => (predicate: any) => {
  const filter =
    typeof predicate === 'function'
      ? ([_, value]: [any, any]) => predicate(value)
      : ([_, value]: [any, any]) => value[predicate];

  return Object.entries(object)
    .filter(filter)
    .reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value
      }),
      {}
    );
};

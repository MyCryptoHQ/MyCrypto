export const getValues = (...args: any[]) =>
  args.reduce((acc, currArg) => [...acc, ...Object.values(currArg)], []);

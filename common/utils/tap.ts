export const tap = <T>(label: string, fn?: (arg0: T) => unknown) => (value: T) => {
  const logger = typeof value !== 'string' ? console.dir : console.debug;
  const content = typeof fn === 'function' ? fn(value) : value;
  logger(`${label}`, content);
  return value;
};

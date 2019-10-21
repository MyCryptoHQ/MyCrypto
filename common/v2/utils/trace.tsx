// Utility to print the values while chaining `.map()`
// usage: myArray.map(trace('Subject Line'))
export const trace = (subject: string) => (value: any) => {
  console.debug(subject, value);
  return value;
};

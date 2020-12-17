// Utility function to check whether a string is valid JSON
export const isValidJSON = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    return false;
  }
};

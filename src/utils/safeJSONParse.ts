// Provides a safe way of parsing JSON and detecting errors
export const safeJSONParse = (str: string) => {
  try {
    return [null, JSON.parse(str)];
  } catch (err) {
    return [err];
  }
};

// Utility function to check whether a string is valid JSON
export const isValidJSON = (str: string) => safeJSONParse(str).length > 1;

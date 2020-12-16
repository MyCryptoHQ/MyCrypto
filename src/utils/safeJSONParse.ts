export const safeJSONParse = (str: string) => {
  try {
    return [null, JSON.parse(str)];
  } catch (err) {
    console.error(err);
    return [err];
  }
};

export const isValidJSON = (str: string) => safeJSONParse(str).length > 1;

import indexOf from 'lodash/indexOf';

export const filter = (i: any, arr: any[]) => {
  return -1 !== indexOf(arr, i) ? true : false;
};

export function checkHttpStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    return new Error(response.statusText);
  }
}

export function parseJSON(response: Response) {
  return response.json();
}

export async function handleJSONResponse(response: Response, errorMessage: string) {
  if (response.ok) {
    return await response.json();
  }
  if (errorMessage) {
    throw new Error(errorMessage);
  }
  return false;
}

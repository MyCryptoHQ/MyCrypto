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

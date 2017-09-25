export function checkHttpStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    // TODO: why assign response?
    // error.response = response;
    throw error;
  }
}

export function parseJSON(response) {
  return response.json();
}

export async function handleJSONResponse(response, errorMessage) {
  if (response.ok) {
    const json = await response.json();
    return json;
  }
  if (errorMessage) {
    throw new Error(errorMessage);
  }
  return false;
}

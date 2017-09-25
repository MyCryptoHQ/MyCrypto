export function checkHttpStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    return new Error(response.statusText);
  }
}

export function parseJSON(response) {
  return response.json();
}

export async function handleJSONResponse(response, errorMessage) {
  if (response.ok) {
    return await response.json();
  }
  if (errorMessage) {
    throw new Error(errorMessage);
  }
  return false;
}

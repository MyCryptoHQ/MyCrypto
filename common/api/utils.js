// Request utils,
// feel free to replace with your code
// (get, post are used in ApiServices)

import { getLocalToken } from 'api/AuthSvc';
import config from 'config';

window.BASE_API = config.BASE_API;

function requestWrapper(method) {
  return async function(url, data = null, params = {}) {
    if (method === 'GET') {
      // is it a GET?
      // GET doesn't have data
      params = data;
      data = null;
    } else if (data === Object(data)) {
      // (data === Object(data)) === _.isObject(data)
      data = JSON.stringify(data);
    } else {
      throw new Error(`XHR invalid, check ${method} on ${url}`);
    }

    // default params for fetch = method + (Content-Type)
    let defaults = {
      method: method,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    };

    // check that req url is relative and request was sent to our domain
    if (url.match(/^https?:\/\//gi) > -1) {
      let token = getLocalToken();
      if (token) {
        defaults.headers['Authorization'] = `JWT ${token}`;
      }
      url = window.BASE_API + url;
    }

    if (data) {
      defaults.body = data;
    }

    let paramsObj = {
      ...defaults,
      headers: { ...params, ...defaults.headers }
    };

    return await fetch(url, paramsObj).then(parseJSON).catch(err => {
      console.error(err);
    });
  };
}

// middlewares
// parse fetch json, add ok property and return request result

/**
 * 1. parse response
 * 2. add "ok" property to result
 * 3. return request result
 * @param  {Object} res - response from server
 * @return {Object} response result with "ok" property
 */
async function parseJSON(res) {
  let json;
  try {
    json = await res.json();
  } catch (e) {
    return { data: {}, ok: false };
  }

  // simplest validation ever, ahah :)
  if (!res.ok) {
    return { data: json, ok: false };
  }
  // resultOK - is a function with side effects
  // It removes ok property from result object
  return { data: json, ok: true };
}

export const get = requestWrapper('GET');
export const post = requestWrapper('POST');
export const put = requestWrapper('PUT');
export const patch = requestWrapper('PATCH');
export const del = requestWrapper('DELETE');

// USAGE:
// get('https://www.google.com', {
//     Authorization: 'JWT LOL',
//     headers: {
//         'Content-Type': 'text/html'
//     }
// })

// FUNCTION WITH SIDE-EFFECTS
/**
 * `parseJSON()` adds property "ok"
 * that identicates that response is OK
 *
 * `resultOK`removes result.ok from result and returns "ok" property
 *  It widely used in `/actions/*`
 *  for choosing action to dispatch after request to API
 *
 * @param  {Object} result - response result that
 * @return {bool} - indicates was request successful or not
 */
export function resultOK(result) {
  if (result) {
    let ok = result.ok;
    delete result.ok;
    return ok; //look at parseJSON
  } else {
    return false;
  }
}

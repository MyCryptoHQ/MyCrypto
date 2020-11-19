import { ClientFunction } from 'testcafe';

/**
 * Testcafe is run in node, while ClientFunctions are run in the DOM.
 * Custom window properties are not immediately available in ClientFunction.
 * https://stackoverflow.com/a/56704217
 */
export const waitForProperty = ClientFunction((predicate, timeout) => {
  return new Promise((resolve, reject) => {
    let intervalId = null;
    let timeoutId = null;

    const checkCondition = function () {
      if (typeof predicate === 'string') return window[predicate];
      else {
        return predicate(window);
      }
    };

    timeoutId = setTimeout(function () {
      clearInterval(intervalId);
      clearInterval(timeoutId);
      if (checkCondition()) resolve(true);
      else reject(false);
    }, timeout || 3000);

    intervalId = setInterval(function () {
      if (checkCondition()) {
        clearInterval(intervalId);
        resolve(true);
      }
    }, 1000);
  });
});

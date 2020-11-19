import { ClientFunction } from 'testcafe';

export const waitForProperty = ClientFunction((windowKey, timeout) => {
  return new Promise(function (resolve, reject) {
    let intervalId = null;
    let timeoutId = null;
    let checkCondition = function () {
      return window[windowKey];
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

import { ClientFunction } from 'testcafe';

const setLocalStorage = ClientFunction((key, dbValue) => {
  localStorage.setItem(key, JSON.stringify(dbValue));
  // Reload to make sure localStorage change is reflected in app state
  window.location.reload();
});
const getLocalStorage = ClientFunction((key) => {
  return localStorage.getItem(key);
});
const clearLocalStorage = ClientFunction((key) => {
  localStorage.removeItem(key);
});

export { setLocalStorage, getLocalStorage, clearLocalStorage };

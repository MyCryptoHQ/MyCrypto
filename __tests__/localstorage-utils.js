import { ClientFunction } from 'testcafe';

const setLocalStorage = ClientFunction((key, dbValue) => {
  localStorage.setItem(key, JSON.stringify(dbValue));
});
const getLocalStorage = ClientFunction((key) => {
  return localStorage.getItem(key);
});
const clearLocalStorage = ClientFunction((key) => {
  localStorage.removeItem(key);
});

export {
  setLocalStorage,
  getLocalStorage,
  clearLocalStorage
};

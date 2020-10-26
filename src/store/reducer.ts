import { combineReducers } from 'redux';

import { path } from '@vendor';

export const getGreeting = path(['demo', 'greeting']);

const demoReducer = () => {
  return {
    greeting: 'Hello from Reducer'
  };
};

export default combineReducers({ demo: demoReducer });

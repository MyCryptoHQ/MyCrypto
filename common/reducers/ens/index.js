// @flow
import domainSelector from './domainSelector';
import domainRequests from './domainRequests';

import { combineReducers } from 'redux';

export const ens = combineReducers({ domainSelector, domainRequests });

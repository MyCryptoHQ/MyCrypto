import React from 'react';
import { Redirect } from 'react-router';

export const RouteNotFound = () => <Redirect to={{ state: { error: true } }} />;

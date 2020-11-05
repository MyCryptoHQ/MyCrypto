import { createAction } from '@reduxjs/toolkit';

export const importState = createAction<string>('state/import');

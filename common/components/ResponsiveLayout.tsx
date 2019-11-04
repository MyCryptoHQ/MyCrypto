import React from 'react';
import Responsive from 'react-responsive';

import { BREAK_POINTS } from 'theme';

export const Desktop = (props: any) => <Responsive {...props} minWidth={BREAK_POINTS.SCREEN_SM} />;
export const Mobile = (props: any) => <Responsive {...props} maxWidth={BREAK_POINTS.SCREEN_SM} />;

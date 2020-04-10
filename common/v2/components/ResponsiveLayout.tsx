import React from 'react';
import Responsive from 'react-responsive';
import * as R from 'ramda';

import { BREAK_POINTS } from 'v2/theme';

// Applies the provided numerical operation to a BREAKPOINT and
// returns a formatted string.
function BPMath(op: (n: number) => number) {
  const BPToNumber = (bp: string) => parseInt(bp.split('px')[0], 10);
  const numberToBP = (n: number) => `${n}px`;
  return R.pipe(BPToNumber, op, numberToBP);
}

const minMobileSize = BPMath(n => n - 1)(BREAK_POINTS.SCREEN_SM);
export const Desktop = (props: any) => <Responsive {...props} minWidth={BREAK_POINTS.SCREEN_SM} />;
export const Mobile = (props: any) => <Responsive {...props} maxWidth={minMobileSize} />;

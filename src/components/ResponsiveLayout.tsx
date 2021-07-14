import pipe from 'ramda/src/pipe';
import Responsive from 'react-responsive';

import { BREAK_POINTS } from '@theme';

// Applies the provided numerical operation to a BREAKPOINT and
// returns a formatted string.
function BPMath(op: (n: number) => number) {
  const BPToNumber = (bp: string) => parseInt(bp.split('px')[0], 10);
  const numberToBP = (n: number) => `${n}px`;
  return pipe(BPToNumber, op, numberToBP);
}

const minMobileSize = BPMath((n) => n - 1)(BREAK_POINTS.SCREEN_SM);
export const Desktop = (props: any) => <Responsive {...props} minWidth={BREAK_POINTS.SCREEN_SM} />;
export const Mobile = (props: any) => <Responsive {...props} maxWidth={minMobileSize} />;

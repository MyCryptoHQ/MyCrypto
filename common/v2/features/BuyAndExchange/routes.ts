import BuyAndExchange from './BuyAndExchange';
import { ShapeShiftDisabled } from './ShapeShift';
import { ZeroEx } from './ZeroEx';

export default [
  {
    name: 'Buy and Exchange | Select Exchange',
    path: '/swap',
    exact: true,
    component: BuyAndExchange
  },
  {
    name: 'Buy and Exchange | ShapeShift',
    path: '/swap/shapeshift',
    component: ShapeShiftDisabled
  },
  {
    name: 'Buy and Exchange | 0x Instant',
    path: '/swap/0x',
    component: ZeroEx
  }
];

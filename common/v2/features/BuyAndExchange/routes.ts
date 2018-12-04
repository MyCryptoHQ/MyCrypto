import BuyAndExchange from './BuyAndExchange';
import { ShapeShiftAuthorization } from './ShapeShift';
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
    component: ShapeShiftAuthorization
  },
  {
    name: 'Buy and Exchange | 0x Instant',
    path: '/swap/0x',
    component: ZeroEx
  }
];

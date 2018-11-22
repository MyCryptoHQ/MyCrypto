import BuyAndExchange from './BuyAndExchange';
import { ShapeShift, ZeroEx } from './containers';

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
    component: ShapeShift
  },
  {
    name: 'Buy and Exchange | 0x Instant',
    path: '/swap/0x',
    component: ZeroEx
  }
];

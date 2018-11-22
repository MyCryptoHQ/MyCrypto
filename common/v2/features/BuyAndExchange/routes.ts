import BuyAndExchange from './BuyAndExchange';
import { ZeroEx } from './containers';

// Legacy
import Swap from 'containers/Tabs/Swap';

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
    component: Swap
  },
  {
    name: 'Buy and Exchange | 0x Instant',
    path: '/swap/0x',
    component: ZeroEx
  }
];

import { ShapeShiftStrategies } from '../types';
import { generateSendScreenLayout as generateBTCSendScreenLayout } from './BTC';
import { generateSendScreenLayout as generateXMRSendScreenLayout } from './XMR';
import { generateSendScreenLayout as generateDefaultSendScreenLayout } from './default';

export default {
  BTC: {
    generateSendScreenLayout: generateBTCSendScreenLayout
  },
  XMR: {
    generateSendScreenLayout: generateXMRSendScreenLayout
  },
  default: {
    generateSendScreenLayout: generateDefaultSendScreenLayout
  }
} as ShapeShiftStrategies;

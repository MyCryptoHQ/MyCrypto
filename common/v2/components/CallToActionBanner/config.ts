import CTABannerVariantOne from './variants/CTABannerOne';
import { CTAVariant, CTAVariantComponentType, ICTAConfigObject } from './types';

export const CTAVariantComponent: CTAVariantComponentType = {
  [CTAVariant.DefiZap]: CTABannerVariantOne
};

export const DeFiZapCTAConfig: ICTAConfigObject = {
  title: 'Invest wisely',
  description: 'Use MyCrypto and DefiZap to invest in crypto wisely!',
  link: '/defi/zap', // TODO: Change this to ROUTE_PATHS.DEFIZAP.path when it exists.
  buttonText: 'Invest now!',
  id: CTAVariant.DefiZap,
  CTAVariant: CTAVariantComponent[CTAVariant.DefiZap]
};

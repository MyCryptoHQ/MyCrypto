import { ROUTE_PATHS } from 'v2/config';
import CTABannerVariantOne from './variants/CTABannerOne';
import { CTAVariant, CTAVariantComponentType, ICTAConfigObject } from './types';

export const CTAVariantComponent: CTAVariantComponentType = {
  [CTAVariant.DefiZap]: CTABannerVariantOne
};

export const DeFiZapCTAConfig: ICTAConfigObject = {
  title: 'Invest wisely',
  description: 'Use MyCrypto and DefiZap to invest in crypto wisely!',
  link: ROUTE_PATHS.DEFIZAP.path,
  buttonText: 'Invest now!',
  id: CTAVariant.DefiZap,
  CTAVariant: CTAVariantComponent[CTAVariant.DefiZap]
};

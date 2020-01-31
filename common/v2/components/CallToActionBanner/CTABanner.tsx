import React from 'react';
import { ConfigProps } from './types';

const CTABanner = ({ config: BannerConfig }: ConfigProps) => {
  return <>{BannerConfig && <BannerConfig.CTAVariant config={BannerConfig} />}</>;
};

export default CTABanner;

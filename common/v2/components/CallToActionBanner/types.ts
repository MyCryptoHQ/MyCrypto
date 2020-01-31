import React from 'react';

export enum CTAVariant {
  DefiZap
}

export type CTAVariantComponentType = {
  readonly [k in CTAVariant]: React.ComponentType<ConfigProps>;
};

export interface ConfigProps {
  config: ICTAConfigObject;
}
export interface ICTAConfigObject {
  title: string;
  description: string;
  link: string;
  buttonText: string;
  id: CTAVariant;
  CTAVariant: React.ComponentType<ConfigProps>;
}

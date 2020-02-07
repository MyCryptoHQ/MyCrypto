import React from 'react';
import translate, { translateRaw } from 'v2/translations';
import { Spinner } from './Spinner';
import { ResolutionError } from '@unstoppabledomains/resolution';

export interface DomainStatusProps {
  isLoading: boolean;
  isError: boolean;
  rawAddress: string;
  domain: string;
  resolutionError?: ResolutionError;
}

export const DomainStatus: React.FC<DomainStatusProps> = (props: DomainStatusProps) => {
  const parseError = (resolutionError?: ResolutionError) => {
    if (!resolutionError)
      return <div data-testid="domainStatus">{`Could not resolve the domain ${props.domain}`}</div>;
    return <div data-testid="domainStatus">{`${resolutionError.message}`}</div>;
  };

  const spinner = () => (
    <div data-testid="domainStatus">
      <Spinner /> {translate('LOADING_ADDRESS')}{' '}
    </div>
  );

  if (props.isLoading) return spinner();
  if (props.domain === '') return <div data-testid="domainStatus">{''}</div>;
  if (props.isError || props.resolutionError) {
    return parseError(props.resolutionError);
  }
  return (
    <div data-testid="domainStatus">{`${translateRaw('SEND_ASSETS_DID_RESOLVE')}: ${
      props.rawAddress
    }`}</div>
  );
};

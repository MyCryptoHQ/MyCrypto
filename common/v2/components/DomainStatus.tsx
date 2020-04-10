import React from 'react';
import { ResolutionError } from '@unstoppabledomains/resolution';
import styled from 'styled-components';

import translate, { translateRaw } from 'v2/translations';

import { Spinner } from './Spinner';
import { InlineMessage } from './InlineMessage';

export interface DomainStatusProps {
  isLoading: boolean;
  isError: boolean;
  rawAddress: string;
  domain: string;
  resolutionError?: ResolutionError;
}

const InlineError = styled(InlineMessage)`
  > :nth-child(2) > :first-child {
    display: inline;
  }
`;

const withInlineError = (children: JSX.Element) => <InlineError>{children}</InlineError>;

export const DomainStatus: React.FC<DomainStatusProps> = (props: DomainStatusProps) => {
  const parseError = (resolutionError?: ResolutionError) => {
    if (!resolutionError)
      return withInlineError(
        <div data-testid="domainStatus">
          {translateRaw('COULD_NOT_RESOLVE_THE_DOMAIN', { $domain: props.domain })}
        </div>
      );
    return withInlineError(<div data-testid="domainStatus">{`${resolutionError.message}`}</div>);
  };

  const spinner = () => (
    <div data-testid="domainStatus">
      <Spinner /> {translate('LOADING_ADDRESS')}{' '}
    </div>
  );

  if (props.isLoading) return spinner();
  if (props.isError || props.resolutionError) {
    return parseError(props.resolutionError);
  }
  if (props.domain === '') return withInlineError(<div data-testid="domainStatus">{''}</div>);
  return withInlineError(
    <div data-testid="domainStatus">{`${translateRaw('SEND_ASSETS_DID_RESOLVE')}: ${
      props.rawAddress
    }`}</div>
  );
};

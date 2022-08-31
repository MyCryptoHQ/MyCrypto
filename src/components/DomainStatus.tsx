import { FC } from 'react';

import { ResolutionError, ResolutionErrorCode } from '@unstoppabledomains/resolution';
import styled from 'styled-components';

import translate, { translateRaw } from '@translations';
import { InlineMessageType } from '@types';

import { InlineMessage } from './InlineMessage';
import { Spinner } from './Spinner';

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

const withInlineError = (children: JSX.Element, type?: InlineMessageType) => (
  <InlineError type={type}>{children}</InlineError>
);

const humanizeEnsError = (error: ResolutionError, props: DomainStatusProps) => {
  if (error.code === ResolutionErrorCode.RecordNotFound) {
    return translateRaw('ENS_NO_ADDRESS_RECORD', { $domain: props.domain });
  }
  return error.message;
};

export const DomainStatus: FC<DomainStatusProps> = (props: DomainStatusProps) => {
  const parseError = (resolutionError?: ResolutionError) => {
    if (!resolutionError)
      return withInlineError(
        <div data-testid="domainStatus">
          {translateRaw('COULD_NOT_RESOLVE_THE_DOMAIN', { $domain: props.domain })}
        </div>
      );
    return withInlineError(
      <div data-testid="domainStatus">{humanizeEnsError(resolutionError, props)}</div>
    );
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
    }`}</div>,
    InlineMessageType.INFO_ARROW
  );
};

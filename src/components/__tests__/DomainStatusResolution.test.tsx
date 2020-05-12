import React from 'react';

import { simpleRender } from 'test-utils';
import { DomainStatus, DomainStatusProps } from '../DomainStatus';
import { ResolutionErrorCode, ResolutionError } from '@unstoppabledomains/resolution';
import UnstoppableService from '@services/UnstoppableService';

const defaultProps: DomainStatusProps = {
  isLoading: false,
  isError: false,
  rawAddress: '',
  domain: ''
};

function getComponent(props: DomainStatusProps) {
  return simpleRender(<DomainStatus {...props} />);
}

const resolution = UnstoppableService;

describe('DomainStatus', () => {
  test('should display resolved address', async () => {
    const props: DomainStatusProps = Object.assign(
      { ...defaultProps },
      {
        domain: 'brad.crypto',
        rawAddress: '0x45b31e01AA6f42F0549aD482BE81635ED3149abb'
      }
    ) as DomainStatusProps;
    const { getByTestId } = getComponent(props);
    expect(getByTestId('domainStatus').textContent).toBe(
      'Resolved Address: 0x45b31e01AA6f42F0549aD482BE81635ED3149abb'
    );
  });

  test('should display the resolutionError', async () => {
    const domain = 'macron2022.crypto';
    const props = Object.assign(
      { ...defaultProps },
      {
        domain,
        rawAddress: domain,
        isError: true,
        resolutionError: new ResolutionError(ResolutionErrorCode.UnspecifiedCurrency, {
          domain,
          recordName: 'ETH',
          currencyTicker: 'ETH'
        })
      }
    );
    const { getByTestId } = getComponent(props);
    expect(getByTestId('domainStatus').textContent).toBe(props.resolutionError.message);
  });

  describe('.UnstoppableService', () => {
    test('should return the valid address', async () => {
      const spy = jest
        .spyOn(resolution, 'getResolvedAddress')
        .mockResolvedValue('0x45b31e01AA6f42F0549aD482BE81635ED3149abb');
      const addr = await resolution.getResolvedAddress('brad.crypto', 'ETH');
      expect(spy).toBeCalled();
      expect(addr).toBe('0x45b31e01AA6f42F0549aD482BE81635ED3149abb');
    });
  });
});

import React from 'react';

import { TURL } from '@types';
import { default as IFrame } from './IFrame';
import { simpleRender, screen, fireEvent } from 'test-utils';

function getComponent(props: React.ComponentProps<typeof IFrame>) {
  return simpleRender(<IFrame {...props} />);
}

const defaultProps = {
  src: 'https://example.com' as TURL,
  onLoad: jest.fn()
};

describe('IFrame', () => {
  it('is visible by default', () => {
    const props = { ...defaultProps };
    getComponent(props);
    expect(screen.getByTestId('iframe')).toHaveStyle('display: default');
  });

  it('can be hidden', () => {
    const props = { ...defaultProps, hidden: true };
    getComponent(props);
    expect(screen.getByTestId('iframe')).toHaveStyle('display: none');
  });

  it('calls onLoad() when loaded', () => {
    const props = { ...defaultProps };
    getComponent(props);
    fireEvent.load(screen.getByTestId('iframe'));
    expect(props.onLoad).toBeCalledTimes(1);
    expect(props.onLoad).toBeCalledWith(screen.getByTestId('iframe'));
  });

  // it('calls onError() when loading error', () => {
  //   const props = { ...defaultProps, onError: jest.fn() };
  //   getComponent(props);
  //   fireEvent.error(screen.getByTestId('iframe'));
  //   expect(props.onError).toBeCalledTimes(1);
  // });
});

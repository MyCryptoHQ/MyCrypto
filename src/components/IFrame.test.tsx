import React from 'react';

import { simpleRender, screen, fireEvent } from 'test-utils';
import { TURL } from '@types';

import { default as IFrame } from './IFrame';

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

  // it('triggers reload on prop change', () => {
  //   const props = { ...defaultProps };
  //   getComponent(props);
  //   screen.rerender(<IFrame {...props} reload={true} />);
  //   expect(props.onLoad).toBeCalledTimes(1);
  //   expect(props.onLoad).toBeCalledWith(screen.getByTestId('iframe'));
  // });
});

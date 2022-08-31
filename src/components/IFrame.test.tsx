import { ComponentProps } from 'react';

import { fireEvent, screen, simpleRender } from 'test-utils';

import { TURL } from '@types';

import { default as IFrame } from './IFrame';

function getComponent(props: ComponentProps<typeof IFrame>) {
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
    expect(props.onLoad).toHaveBeenCalledTimes(1);
    expect(props.onLoad).toHaveBeenCalledWith(screen.getByTestId('iframe'));
  });
});

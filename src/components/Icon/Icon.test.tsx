import React from 'react';

import { expectToThrow, simpleRender } from 'test-utils';

import Icon from './Icon';

type Props = React.ComponentProps<typeof Icon>;
const renderComponent = (props: Props) => simpleRender(<Icon {...props} />);

describe('Icon', () => {
  it('renders a SVG Icon by type', () => {
    const { container } = renderComponent({ type: 'add' });
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
  it('renders a PNG Icon by type', () => {
    const { container } = renderComponent({ type: 'uni-logo' });
    expect(container.querySelector('img')).toBeInTheDocument();
  });
  it('throws an Error when type is invalid', () => {
    return expectToThrow(
      () => renderComponent({ type: 'dummy-type' as Props['type'] }),
      new Error('[Icon]: Invalid type property')
    );
  });
});

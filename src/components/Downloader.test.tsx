import React from 'react';

import { fireEvent, screen, simpleRender } from 'test-utils';

import { LocalStorage } from '@types';

import Downloader from './Downloader';

const getComponent = (
  props: React.ComponentProps<typeof Downloader>,
  children?: React.ComponentType<any>
) => {
  const Component = children;
  return Component
    ? simpleRender(
        <Downloader {...props}>
          <Component />
        </Downloader>
      )
    : simpleRender(<Downloader {...props} />);
};

const dummyState = ({ foo: 'bar' } as unknown) as LocalStorage;
describe('Downloader', () => {
  beforeEach(() => {
    window.URL.createObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('has a button by default', () => {
    getComponent({ data: dummyState });
    expect(screen.getByText(/download/i)).toBeInTheDocument();
  });

  it('renders its children who replace the default button', () => {
    getComponent({ data: dummyState, onClick: () => <button>Hello</button> });
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
    expect(screen.queryByText(/download/i)).not.toBeInTheDocument();
  });

  it('calls the provided callback on click', () => {
    const cb = jest.fn();
    getComponent({ data: dummyState, onClick: cb }, () => <button>Hello</button>);
    fireEvent.click(screen.getByText(/hello/i));
    expect(cb).toHaveBeenCalledTimes(1);
  });
});

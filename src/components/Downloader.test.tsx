import { ComponentProps, ComponentType } from 'react';

import { fireEvent, screen, simpleRender } from 'test-utils';

import { Downloader } from './Downloader';

const getComponent = (props: ComponentProps<typeof Downloader>, children?: ComponentType<any>) => {
  const Component = children;
  return Component
    ? simpleRender(
        <Downloader {...props}>
          <Component />
        </Downloader>
      )
    : simpleRender(<Downloader {...props} />);
};

describe('Downloader', () => {
  beforeEach(() => {
    window.URL.createObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('has a button by default', () => {
    getComponent({ data: { foo: 'bar' }, fileName: 'bla.json' });
    expect(screen.getByText(/download/i)).toBeInTheDocument();
  });

  it('renders its children who replace the default button', () => {
    getComponent({ data: { foo: 'bar' }, fileName: 'bla.json' }, () => <button>Hello</button>);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
    expect(screen.queryByText(/download/i)).not.toBeInTheDocument();
  });

  it('calls the provided callback on click', () => {
    const cb = jest.fn();
    getComponent({ data: { foo: 'bar' }, fileName: 'bla.json', onClick: cb }, () => (
      <button>Hello</button>
    ));
    fireEvent.click(screen.getByText(/hello/i));
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
